import { Accessor, Document, NodeIO } from '@gltf-transform/core';

const srgbToLinear = (c) => {
  if (c <= 0.04045) return c / 12.92;
  return Math.pow((c + 0.055) / 1.055, 2.4);
};

const hexToLinearBaseColorFactor = (hex, alpha = 1) => {
  const r = ((hex >> 16) & 255) / 255;
  const g = ((hex >> 8) & 255) / 255;
  const b = (hex & 255) / 255;
  return [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b), alpha];
};

const guessMimeType = (uri) => {
  if (!uri || typeof uri !== 'string') return null;
  const lower = uri.toLowerCase();
  if (lower.startsWith('data:')) {
    const match = lower.match(/^data:([^;,]+)[;,]/);
    return match ? match[1] : null;
  }
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.jpg') || lower.includes('.jpeg')) return 'image/jpeg';
  return null;
};

const readDataUri = (uri) => {
  const match = uri.match(/^data:([^;,]+)?(;base64)?,(.*)$/);
  if (!match) throw new Error('Invalid data URI');
  const mimeType = match[1] || null;
  const isBase64 = Boolean(match[2]);
  const data = match[3] || '';

  if (isBase64) {
    return { mimeType, bytes: Buffer.from(data, 'base64') };
  }

  return { mimeType, bytes: Buffer.from(decodeURIComponent(data), 'utf8') };
};

const fetchBinary = async (uri) => {
  if (typeof uri !== 'string' || !uri) throw new Error('Texture URI is missing');

  if (uri.startsWith('data:')) {
    const { mimeType, bytes } = readDataUri(uri);
    return { mimeType, bytes };
  }

  const res = await fetch(uri);
  if (!res.ok) throw new Error(`Failed to fetch texture ${uri} (HTTP ${res.status})`);
  const arrayBuffer = await res.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);
  const mimeType = guessMimeType(uri) || res.headers.get('content-type') || null;
  return { mimeType, bytes };
};

const getTypedArrayCopy = (arrayLike) => {
  if (!arrayLike) return null;
  if (ArrayBuffer.isView(arrayLike)) {
    return new arrayLike.constructor(arrayLike);
  }
  return null;
};

const getTextureDef = (texturesByType, elementType, textureKey) => {
  if (!texturesByType || !elementType || !textureKey) return null;
  const byType = texturesByType[elementType];
  if (!byType) return null;
  return byType[textureKey] || null;
};

const applyUvRepeat = (uvArray, repeatU, repeatV) => {
  if (!uvArray || !Number.isFinite(repeatU) || !Number.isFinite(repeatV)) return;
  for (let i = 0; i < uvArray.length; i += 2) {
    uvArray[i + 0] *= repeatU;
    uvArray[i + 1] *= repeatV;
  }
};

export async function exportThreeSceneToGlb(threeScene, { texturesByType } = {}) {
  threeScene.updateMatrixWorld(true);

  const document = new Document();
  const buffer = document.createBuffer('buffer');
  const gltfScene = document.createScene('scene');
  document.getRoot().setDefaultScene(gltfScene);

  const texturePromiseCache = new Map();
  const materialPromiseCache = new Map();

  const getOrCreateTexture = async (uri) => {
    if (texturePromiseCache.has(uri)) return await texturePromiseCache.get(uri);

    const promise = (async () => {
      const { mimeType, bytes } = await fetchBinary(uri);
      const tex = document.createTexture(uri.split('/').pop() || 'texture');
      if (mimeType) tex.setMimeType(mimeType);
      tex.setImage(bytes);
      return tex;
    })();

    texturePromiseCache.set(uri, promise);
    return await promise;
  };

  const getOrCreateMaterialForMesh = async (rp) => {
    const kind = rp?.kind || 'default';
    const elementType = rp?.elementType || '';
    const textureKey = rp?.textureKey || '';
    const textureDef = getTextureDef(texturesByType, elementType, textureKey);

    const baseColorFactor = textureDef
      ? [1, 1, 1, 1]
      : hexToLinearBaseColorFactor(Number.isFinite(rp?.color) ? rp.color : 0xd0d0d0);

    const normalUri = textureDef?.normal?.uri || '';
    const normalScaleX = textureDef?.normal?.normalScaleX;
    const normalScaleY = textureDef?.normal?.normalScaleY;
    const normalScale =
      Number.isFinite(Number(normalScaleX)) && Number.isFinite(Number(normalScaleY))
        ? (Number(normalScaleX) + Number(normalScaleY)) / 2
        : Number.isFinite(Number(normalScaleX))
          ? Number(normalScaleX)
          : 1;

    const key = JSON.stringify({
      kind,
      elementType,
      textureUri: textureDef?.uri || '',
      normalUri,
      baseColorFactor,
      doubleSided: kind === 'floor'
    });

    if (materialPromiseCache.has(key)) return await materialPromiseCache.get(key);

    const promise = (async () => {
      const material = document
        .createMaterial(kind)
        .setBaseColorFactor(baseColorFactor)
        .setMetallicFactor(0)
        .setRoughnessFactor(1);

      if (kind === 'floor') material.setDoubleSided(true);

      if (textureDef?.uri) {
        const baseTexture = await getOrCreateTexture(textureDef.uri);
        material.setBaseColorTexture(baseTexture);
      }

      if (textureDef?.normal?.uri) {
        const normalTexture = await getOrCreateTexture(textureDef.normal.uri);
        material.setNormalTexture(normalTexture);
        if (Number.isFinite(normalScale)) material.setNormalScale(normalScale);
      }

      return material;
    })();

    materialPromiseCache.set(key, promise);
    return await promise;
  };

  const meshes = [];
  threeScene.traverse((obj) => {
    if (obj && obj.isMesh && obj.geometry) meshes.push(obj);
  });

  for (let index = 0; index < meshes.length; index++) {
    const mesh = meshes[index];
    const geometry = mesh.geometry?.clone?.();
    if (!geometry || !geometry.isBufferGeometry) continue;

    geometry.applyMatrix4(mesh.matrixWorld);
    if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();

    const positionAttr = geometry.getAttribute('position');
    const normalAttr = geometry.getAttribute('normal');
    const uvAttr = geometry.getAttribute('uv');
    const indexAttr = geometry.getIndex();

    if (!positionAttr) continue;

    const positionArray = getTypedArrayCopy(positionAttr.array);
    const normalArray = normalAttr ? getTypedArrayCopy(normalAttr.array) : null;
    const uvArray = uvAttr ? getTypedArrayCopy(uvAttr.array) : null;
    const indexArray = indexAttr ? getTypedArrayCopy(indexAttr.array) : null;

    const positionAccessor = document
      .createAccessor()
      .setType(Accessor.Type.VEC3)
      .setArray(positionArray)
      .setBuffer(buffer);

    const primitive = document.createPrimitive().setAttribute('POSITION', positionAccessor);

    if (normalArray) {
      const normalAccessor = document
        .createAccessor()
        .setType(Accessor.Type.VEC3)
        .setArray(normalArray)
        .setBuffer(buffer);
      primitive.setAttribute('NORMAL', normalAccessor);
    }

    if (uvArray) {
      const rp = mesh.userData?.rp;
      const textureDef = getTextureDef(texturesByType, rp?.elementType || null, rp?.textureKey || null);
      if (textureDef) {
        const scaleU = Number(textureDef.lengthRepeatScale);
        const scaleV = Number(textureDef.heightRepeatScale);

        let sizeU = 0;
        let sizeV = 0;

        if (rp?.kind === 'wall') {
          sizeU = Number(rp.wallLength);
          sizeV = Number(rp.wallHeight);
        } else if (rp?.kind === 'floor') {
          sizeU = Number(rp.width);
          sizeV = Number(rp.height);
        }

        const repeatU = Number.isFinite(sizeU) && Number.isFinite(scaleU) ? sizeU * scaleU : 1;
        const repeatV = Number.isFinite(sizeV) && Number.isFinite(scaleV) ? sizeV * scaleV : 1;

        applyUvRepeat(uvArray, repeatU || 1, repeatV || 1);
      }

      const uvAccessor = document
        .createAccessor()
        .setType(Accessor.Type.VEC2)
        .setArray(uvArray)
        .setBuffer(buffer);
      primitive.setAttribute('TEXCOORD_0', uvAccessor);
    }

    if (indexArray) {
      const indexAccessor = document
        .createAccessor()
        .setType(Accessor.Type.SCALAR)
        .setArray(indexArray)
        .setBuffer(buffer);
      primitive.setIndices(indexAccessor);
    }

    const rp = mesh.userData?.rp;
    const material = await getOrCreateMaterialForMesh(rp);
    primitive.setMaterial(material);

    const gltfMesh = document.createMesh(mesh.name || `mesh-${index}`).addPrimitive(primitive);
    const node = document.createNode(mesh.name || `node-${index}`).setMesh(gltfMesh);
    gltfScene.addChild(node);
  }

  const io = new NodeIO();
  return await io.writeBinary(document);
}
