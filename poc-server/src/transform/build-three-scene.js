import * as THREE from 'three';

const DEFAULT_WALL_HEIGHT = 300;
const DEFAULT_WALL_THICKNESS = 20;
const DEFAULT_HOLE_WIDTH = 90;
const DEFAULT_HOLE_HEIGHT = 210;
const DEFAULT_HOLE_ALTITUDE = 0;
const DEFAULT_ITEM_WIDTH = 80;
const DEFAULT_ITEM_DEPTH = 80;
const DEFAULT_ITEM_HEIGHT = 80;

const normalizeMapOrList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return Object.values(value);
};

const buildIdMap = (value) => {
  if (!value) return {};
  if (!Array.isArray(value)) return value;
  const map = {};
  value.forEach((entry) => {
    if (entry && entry.id !== undefined && entry.id !== null) {
      map[entry.id] = entry;
    }
  });
  return map;
};

const getLengthProp = (properties, propName, fallback) => {
  const raw = properties?.[propName];
  const length = raw?.length;
  const num = Number(length);
  return Number.isFinite(num) ? num : fallback;
};

const getOptionalLengthProp = (properties, propName) => {
  const raw = properties?.[propName];
  if (raw === undefined || raw === null) return null;
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  const length = raw?.length;
  const num = Number(length);
  return Number.isFinite(num) ? num : null;
};

const parseHexColor = (value, fallback = 0xcfcfcf) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return fallback;

  const trimmed = value.trim();
  if (!trimmed.startsWith('#')) return fallback;
  const hex = trimmed.slice(1);
  if (hex.length !== 6) return fallback;
  const parsed = Number.parseInt(hex, 16);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const buildFloorMesh = ({ area, layer, verticesById, areasById }) => {
  const vertexIds = Array.isArray(area?.vertices) ? area.vertices : [];
  if (vertexIds.length < 3) return null;

  const getVertex = (vertexId) => {
    const v = verticesById?.[vertexId];
    if (!v) throw new Error(`Missing vertex ${vertexId} (area ${area?.id || area?.type || 'unknown'})`);
    return { x: Number(v.x), y: Number(v.y) };
  };

  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  vertexIds.forEach((vertexId) => {
    const { x, y } = getVertex(vertexId);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  const width = maxX - minX;
  const height = maxY - minY;

  const shape = new THREE.Shape();
  const first = getVertex(vertexIds[0]);
  shape.moveTo(first.x, first.y);
  for (let i = 1; i < vertexIds.length; i++) {
    const v = getVertex(vertexIds[i]);
    shape.lineTo(v.x, v.y);
  }

  const holeAreaIds = Array.isArray(area?.holes) ? area.holes : [];
  holeAreaIds.forEach((holeAreaId) => {
    const holeArea = areasById?.[holeAreaId];
    if (!holeArea) return;
    const holeVertexIds = Array.isArray(holeArea.vertices) ? holeArea.vertices : [];
    if (holeVertexIds.length < 3) return;

    const path = new THREE.Path();
    const holeFirst = getVertex(holeVertexIds[holeVertexIds.length - 1]);
    path.moveTo(holeFirst.x, holeFirst.y);
    for (let i = holeVertexIds.length - 2; i >= 0; i--) {
      const v = getVertex(holeVertexIds[i]);
      path.lineTo(v.x, v.y);
    }
    shape.holes.push(path);
  });

  const geometry = new THREE.ShapeGeometry(shape);
  geometry.rotateX(-Math.PI / 2);

  if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
    const posAttr = geometry.getAttribute('position');
    const uvArray = new Float32Array(posAttr.count * 2);

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const y2d = -z;
      uvArray[i * 2 + 0] = (x - minX) / width;
      uvArray[i * 2 + 1] = (y2d - minY) / height;
    }

    geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
  }

  const material = new THREE.MeshStandardMaterial({
    color: parseHexColor(area?.properties?.patternColor, 0xdcdcdc),
    metalness: 0,
    roughness: 1,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = area?.name || area?.type || area?.id || 'area';
  mesh.position.y = 0;
  mesh.userData.rp = {
    kind: 'floor',
    elementType: area?.type || null,
    textureKey:
      typeof area?.properties?.texture === 'string' && area.properties.texture !== 'none'
        ? area.properties.texture
        : null,
    color: parseHexColor(area?.properties?.patternColor, 0xdcdcdc),
    width,
    height,
    layerId: layer?.id || null
  };
  return mesh;
};

const buildWallGroup = ({ line, layer, verticesById, holesById }) => {
  const vertexIds = Array.isArray(line?.vertices) ? line.vertices : [];
  if (vertexIds.length < 2) return null;

  const v0 = verticesById?.[vertexIds[0]];
  const v1 = verticesById?.[vertexIds[1]];
  if (!v0 || !v1) return null;

  const start = new THREE.Vector3(Number(v0.x), 0, -Number(v0.y));
  const end = new THREE.Vector3(Number(v1.x), 0, -Number(v1.y));
  const dir = new THREE.Vector3().subVectors(end, start);
  const length = dir.length();
  if (!Number.isFinite(length) || length <= 1e-6) return null;

  const height = getLengthProp(line?.properties, 'height', DEFAULT_WALL_HEIGHT);
  const thickness = getLengthProp(line?.properties, 'thickness', DEFAULT_WALL_THICKNESS);

  const yaw = Math.atan2(dir.z, dir.x);
  const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

  const group = new THREE.Group();
  group.name = line?.name || line?.type || line?.id || 'wall';
  group.position.set(center.x, 0, center.z);
  group.rotation.y = yaw;
  group.userData.kind = 'wall';
  group.userData.layerId = layer?.id || null;

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xd3d3d3, metalness: 0, roughness: 1 });
  const textureKey =
    typeof line?.properties?.textureB === 'string' && line.properties.textureB !== 'none'
      ? line.properties.textureB
      : typeof line?.properties?.textureA === 'string' && line.properties.textureA !== 'none'
        ? line.properties.textureA
        : null;

  const holes = (Array.isArray(line?.holes) ? line.holes : [])
    .map((holeId) => holesById?.[holeId])
    .filter(Boolean)
    .map((hole) => {
      const offset = Number(hole.offset);
      if (!Number.isFinite(offset)) return null;

      const width = getLengthProp(hole.properties, 'width', DEFAULT_HOLE_WIDTH);
      const holeHeight = getLengthProp(hole.properties, 'height', DEFAULT_HOLE_HEIGHT);
      const altitude = getLengthProp(hole.properties, 'altitude', DEFAULT_HOLE_ALTITUDE);

      const centerX = offset * length - length / 2;
      const startX = clamp(centerX - width / 2, -length / 2, length / 2);
      const endX = clamp(centerX + width / 2, -length / 2, length / 2);
      const clampedWidth = endX - startX;
      if (clampedWidth <= 1e-6) return null;

      return {
        startX,
        endX,
        width: clampedWidth,
        centerX: (startX + endX) / 2,
        altitude: clamp(altitude, 0, height),
        holeHeight: clamp(holeHeight, 0, height)
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.startX - b.startX);

  const segments = [];
  let cursorX = -length / 2;

  holes.forEach((hole) => {
    const leftLen = hole.startX - cursorX;
    if (leftLen > 1e-6) {
      segments.push({ len: leftLen, cx: cursorX + leftLen / 2, h: height, cy: height / 2, name: 'wall-seg' });
    }

    const bottomHeight = hole.altitude;
    if (bottomHeight > 1e-6) {
      segments.push({ len: hole.width, cx: hole.centerX, h: bottomHeight, cy: bottomHeight / 2, name: 'wall-sill' });
    }

    const holeTop = hole.altitude + hole.holeHeight;
    const topHeight = height - holeTop;
    if (topHeight > 1e-6) {
      segments.push({ len: hole.width, cx: hole.centerX, h: topHeight, cy: holeTop + topHeight / 2, name: 'wall-lintel' });
    }

    cursorX = Math.max(cursorX, hole.endX);
  });

  const rightLen = length / 2 - cursorX;
  if (rightLen > 1e-6) {
    segments.push({ len: rightLen, cx: cursorX + rightLen / 2, h: height, cy: height / 2, name: 'wall-seg' });
  }

  if (segments.length === 0) {
    segments.push({ len: length, cx: 0, h: height, cy: height / 2, name: 'wall' });
  }

  segments.forEach((seg, idx) => {
    const geometry = new THREE.BoxGeometry(seg.len, seg.h, thickness);
    if (Number.isFinite(length) && length > 0 && Number.isFinite(height) && height > 0) {
      const posAttr = geometry.getAttribute('position');
      const uvArray = new Float32Array(posAttr.count * 2);

      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i) + seg.cx;
        const y = posAttr.getY(i) + seg.cy;
        uvArray[i * 2 + 0] = x / length + 0.5;
        uvArray[i * 2 + 1] = y / height;
      }

      geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
    }

    const mesh = new THREE.Mesh(geometry, wallMaterial);
    mesh.name = `${seg.name}-${idx}`;
    mesh.position.set(seg.cx, seg.cy, 0);
    mesh.userData.rp = {
      kind: 'wall',
      elementType: line?.type || null,
      textureKey,
      wallLength: length,
      wallHeight: height,
      color: 0xd3d3d3,
      layerId: layer?.id || null
    };
    group.add(mesh);
  });

  return group;
};

const buildItemMesh = ({ item }) => {
  if (!item) return null;
  const props = item.properties || {};
  const lengthFallback = getOptionalLengthProp(props, 'length');
  const width = getOptionalLengthProp(props, 'width') ?? lengthFallback ?? DEFAULT_ITEM_WIDTH;
  const depth = getOptionalLengthProp(props, 'depth') ?? width ?? DEFAULT_ITEM_DEPTH;
  const height = getOptionalLengthProp(props, 'height') ?? DEFAULT_ITEM_HEIGHT;
  const altitude = getOptionalLengthProp(props, 'altitude') ?? 0;

  if (!Number.isFinite(width) || !Number.isFinite(depth) || !Number.isFinite(height)) return null;
  if (width <= 1e-6 || depth <= 1e-6 || height <= 1e-6) return null;

  const colorValue = parseHexColor(props.color || props.patternColor, 0xcfcfcf);
  const material = new THREE.MeshStandardMaterial({
    color: colorValue,
    metalness: 0,
    roughness: 1
  });
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = item?.name || item?.type || item?.id || 'item';
  mesh.position.y = altitude + height / 2;
  mesh.userData.rp = {
    kind: 'item',
    elementType: item?.type || null,
    color: colorValue
  };
  return mesh;
};

const buildHoleMesh = ({ hole, line, verticesById }) => {
  if (!hole || !line) return null;
  const vertexIds = Array.isArray(line?.vertices) ? line.vertices : [];
  if (vertexIds.length < 2) return null;
  const v0 = verticesById?.[vertexIds[0]];
  const v1 = verticesById?.[vertexIds[1]];
  if (!v0 || !v1) return null;

  const start = new THREE.Vector2(Number(v0.x), Number(v0.y));
  const end = new THREE.Vector2(Number(v1.x), Number(v1.y));
  const dir = new THREE.Vector2().subVectors(end, start);
  const length = dir.length();
  if (!Number.isFinite(length) || length <= 1e-6) return null;

  const offset = Number(hole.offset);
  const clampedOffset = Number.isFinite(offset) ? clamp(offset, 0, 1) : 0.5;
  const center2d = new THREE.Vector2().copy(start).add(dir.multiplyScalar(clampedOffset));

  const width = getLengthProp(hole?.properties, 'width', DEFAULT_HOLE_WIDTH);
  const height = getLengthProp(hole?.properties, 'height', DEFAULT_HOLE_HEIGHT);
  const altitude = getLengthProp(hole?.properties, 'altitude', DEFAULT_HOLE_ALTITUDE);
  const thickness = getLengthProp(line?.properties, 'thickness', DEFAULT_WALL_THICKNESS);

  if (!Number.isFinite(width) || !Number.isFinite(height) || !Number.isFinite(thickness)) return null;

  const geometry = new THREE.BoxGeometry(width, height, thickness);
  const material = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, metalness: 0, roughness: 1 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = hole?.name || hole?.type || hole?.id || 'hole';
  mesh.position.y = altitude + height / 2;
  mesh.userData.rp = {
    kind: 'hole',
    elementType: hole?.type || null,
    color: 0xb0b0b0
  };

  const group = new THREE.Group();
  group.name = `${mesh.name}-group`;
  group.position.set(center2d.x, 0, -center2d.y);
  group.rotation.y = Math.atan2(-dir.y, dir.x);
  group.add(mesh);
  return group;
};

export function buildThreeSceneFromReactPlannerScene(sceneJson) {
  const scene = new THREE.Scene();
  scene.name = 'ReactPlannerScene';

  const root = new THREE.Group();
  root.name = 'ReactPlannerModel';
  scene.add(root);

  const layers = normalizeMapOrList(sceneJson?.layers);

  layers.forEach((layer) => {
    if (layer?.visible === false) return;

    const layerGroup = new THREE.Group();
    layerGroup.name = `layer-${layer?.id || 'unknown'}`;
    layerGroup.position.y = Number(layer?.altitude) || 0;

    const verticesById = buildIdMap(layer?.vertices);
    const holesById = buildIdMap(layer?.holes);
    const areasById = buildIdMap(layer?.areas);
    const linesById = buildIdMap(layer?.lines);

    normalizeMapOrList(layer?.areas).forEach((area) => {
      const floor = buildFloorMesh({ area, layer, verticesById, areasById });
      if (floor) layerGroup.add(floor);
    });

    normalizeMapOrList(layer?.lines).forEach((line) => {
      const wall = buildWallGroup({ line, layer, verticesById, holesById });
      if (wall) layerGroup.add(wall);
    });

    normalizeMapOrList(layer?.holes).forEach((hole) => {
      const line = linesById?.[hole?.line];
      const holeMesh = buildHoleMesh({ hole, line, verticesById });
      if (holeMesh) layerGroup.add(holeMesh);
    });

    normalizeMapOrList(layer?.items).forEach((item) => {
      const itemMesh = buildItemMesh({ item });
      if (!itemMesh) return;
      const pivot = new THREE.Group();
      pivot.name = `${itemMesh.name}-pivot`;
      pivot.rotation.y = Number(item?.rotation) * Math.PI / 180;
      pivot.position.set(Number(item?.x) || 0, 0, -(Number(item?.y) || 0));
      pivot.add(itemMesh);
      layerGroup.add(pivot);
    });

    root.add(layerGroup);
  });

  return scene;
}
