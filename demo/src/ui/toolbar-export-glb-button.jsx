import React from 'react';
import PropTypes from 'prop-types';
import { MdCloudDownload } from 'react-icons/md';
import * as Three from 'three';
import { ReactPlannerComponents, ReactPlannerClasses } from 'react-planner';
import MyCatalog from '../catalog/mycatalog';

if (typeof window !== 'undefined') {
  window.THREE = Three;
}

require('three/examples/js/exporters/GLTFExporter');

const { ToolbarButton } = ReactPlannerComponents.ToolbarComponents;
const { Project } = ReactPlannerClasses;

const DEFAULT_ENDPOINT = 'http://localhost:3100/export/glb';

const normalizeMapOrList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return Object.values(value);
};

const toAbsoluteUrl = (uri) => {
  if (!uri || typeof uri !== 'string') return uri;
  try {
    return new URL(uri, window.location.href).toString();
  } catch (e) {
    return uri;
  }
};

const absolutizeTexture = (texture) => {
  if (!texture || typeof texture !== 'object') return texture;
  const out = { ...texture, uri: toAbsoluteUrl(texture.uri) };
  if (texture.normal && typeof texture.normal === 'object') {
    out.normal = { ...texture.normal, uri: toAbsoluteUrl(texture.normal.uri) };
  }
  return out;
};

const buildTexturesByTypeForScene = (sceneJson) => {
  const usedTypes = new Set();

  normalizeMapOrList(sceneJson && sceneJson.layers).forEach((layer) => {
    normalizeMapOrList(layer && layer.lines).forEach((line) => {
      if (line && typeof line.type === 'string') usedTypes.add(line.type);
    });
    normalizeMapOrList(layer && layer.areas).forEach((area) => {
      if (area && typeof area.type === 'string') usedTypes.add(area.type);
    });
  });

  const texturesByType = {};
  usedTypes.forEach((type) => {
    let element = null;
    try {
      element = MyCatalog.getElement(type);
    } catch (e) {
      return;
    }
    const textures = element && element.textures;
    if (!textures || typeof textures !== 'object') return;

    const absolutized = {};
    Object.keys(textures).forEach((key) => {
      absolutized[key] = absolutizeTexture(textures[key]);
    });
    texturesByType[type] = absolutized;
  });

  return texturesByType;
};

const downloadBlob = (blob, translator) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  const defaultName = `react-planner-${Date.now()}.glb`;
  const filename = window.prompt(translator.t('Insert output filename'), defaultName);
  if (!filename) return;
  link.setAttribute('download', filename.endsWith('.glb') ? filename : `${filename}.glb`);
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const sanitizePlanForExport = (plan) => {
  if (!plan) return;
  plan.updateMatrixWorld(true);

  plan.traverse((object) => {
    if (!object) return;
    object.matrixAutoUpdate = true;
    object.updateMatrix();
    object.updateMatrixWorld(true);

    const elements = object.matrix && object.matrix.elements;
    if (elements && elements.length === 16) {
      let valid = true;
      for (let i = 0; i < elements.length; i++) {
        if (!Number.isFinite(elements[i])) {
          valid = false;
          break;
        }
      }
      if (!valid) {
        object.matrix.identity();
      }
    }

    if (!object.isMesh) return;
    const geometry = object.geometry;
    if (!geometry || !geometry.isBufferGeometry) return;

    const materials = Array.isArray(object.material) ? object.material : [object.material];
    const needsNormalMap = materials.some((mat) => mat && mat.normalMap);

    if (!needsNormalMap) return;
    if (!geometry.getAttribute('tangent')) {
      const hasUv = Boolean(geometry.getAttribute('uv'));
      const hasNormal = Boolean(geometry.getAttribute('normal'));
      if (hasUv && hasNormal && geometry.index && geometry.computeTangents) {
        geometry.computeTangents();
      }
    }

    const tangentAttr = geometry.getAttribute('tangent');
    let validTangents = Boolean(tangentAttr && tangentAttr.array);
    if (validTangents) {
      const array = tangentAttr.array;
      for (let i = 0; i < array.length; i += 4) {
        const x = array[i + 0];
        const y = array[i + 1];
        const z = array[i + 2];
        const len = Math.hypot(x, y, z);
        if (!Number.isFinite(len) || len <= 1e-6) {
          validTangents = false;
          break;
        }
      }
    }

    if (!validTangents) {
      if (geometry.getAttribute('tangent')) {
        geometry.deleteAttribute('tangent');
      }
      materials.forEach((mat) => {
        if (mat && mat.normalMap) {
          mat.normalMap = null;
        }
      });
    }
  });
};

const exportPlanToGlb = (plan) => {
  return new Promise((resolve, reject) => {
    try {
      if (!plan || !Three.GLTFExporter) {
        reject(new Error('missing-plan'));
        return;
      }
      sanitizePlanForExport(plan);
      const exporter = new Three.GLTFExporter();
      exporter.parse(
        plan,
        (result) => {
          if (result instanceof ArrayBuffer) {
            resolve(new Blob([result], { type: 'model/gltf-binary' }));
          } else {
            resolve(new Blob([JSON.stringify(result)], { type: 'application/json' }));
          }
        },
        { binary: true, onlyVisible: true, embedImages: true }
      );
    } catch (error) {
      reject(error);
    }
  });
};

export default function ToolbarExportGLBButton({ state }, { translator }) {
  const [exporting, setExporting] = React.useState(false);

  const exportToGLB = (event) => {
    event.preventDefault();
    if (exporting) return;

    setExporting(true);

    const cleanState = Project.unselectAll(state).updatedState;
    const sceneJson = cleanState.get('scene').toJS();
    const texturesByType = buildTexturesByTypeForScene(sceneJson);
    const plan = window.__reactPlannerPlan;

    exportPlanToGlb(plan)
      .then((blob) => {
        downloadBlob(blob, translator);
      })
      .catch(() => {
        fetch(window.REACT_PLANNER_GLB_EXPORT_ENDPOINT || DEFAULT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scene: sceneJson, texturesByType })
        })
          .then((res) => {
            if (!res.ok) {
              return res.text().then((text) => {
                throw new Error(text || `HTTP ${res.status}`);
              });
            }
            return res.blob();
          })
          .then((blob) => {
            downloadBlob(blob, translator);
          })
          .catch((err) => {
            console.error(err);
            const message = err && err.message ? err.message : String(err);
            alert(`${translator.t('Export failed')}: ${message}`);
          })
          .then(() => setExporting(false));
        return null;
      })
      .then(() => setExporting(false));
  };

  return (
    <ToolbarButton active={exporting} tooltip={translator.t('Export GLB')} onClick={exportToGLB}>
      <MdCloudDownload />
    </ToolbarButton>
  );
}

ToolbarExportGLBButton.propTypes = {
  state: PropTypes.object.isRequired
};

ToolbarExportGLBButton.contextTypes = {
  translator: PropTypes.object.isRequired
};
