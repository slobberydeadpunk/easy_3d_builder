import http from 'node:http';

import { buildThreeSceneFromReactPlannerScene } from './transform/build-three-scene.js';
import { exportThreeSceneToGlb } from './transform/export-glb.js';
import { readJsonBody } from './utils/http.js';

const PORT = Number.parseInt(process.env.PORT || '3100', 10);
const MAX_BODY_BYTES = Number.parseInt(process.env.MAX_BODY_BYTES || `${10 * 1024 * 1024}`, 10);

const withCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const server = http.createServer(async (req, res) => {
  withCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method === 'POST' && req.url === '/export/glb') {
    try {
      const body = await readJsonBody(req, { maxBytes: MAX_BODY_BYTES });
      const sceneJson = body && body.scene ? body.scene : body;
      const texturesByType = body && body.texturesByType ? body.texturesByType : null;

      const threeScene = buildThreeSceneFromReactPlannerScene(sceneJson);
      const glb = await exportThreeSceneToGlb(threeScene, { texturesByType });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'model/gltf-binary');
      res.setHeader('Content-Disposition', 'attachment; filename="react-planner.glb"');
      res.end(Buffer.from(glb));
    } catch (err) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: err?.message || String(err) }));
    }
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: false, error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Export PoC server listening on http://localhost:${PORT}`);
});
