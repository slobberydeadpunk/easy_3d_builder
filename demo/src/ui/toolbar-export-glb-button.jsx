import React from 'react';
import PropTypes from 'prop-types';
import { MdCloudDownload } from 'react-icons/md';
import { ReactPlannerComponents, ReactPlannerClasses } from 'react-planner';
import MyCatalog from '../catalog/mycatalog';

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

export default function ToolbarExportGLBButton({ state }, { translator }) {
  const [exporting, setExporting] = React.useState(false);

  const exportToGLB = (event) => {
    event.preventDefault();
    if (exporting) return;

    setExporting(true);

    const cleanState = Project.unselectAll(state).updatedState;
    const sceneJson = cleanState.get('scene').toJS();
    const texturesByType = buildTexturesByTypeForScene(sceneJson);

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
      })
      .catch((err) => {
        console.error(err);
        const message = err && err.message ? err.message : String(err);
        alert(`${translator.t('Export failed')}: ${message}`);
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
