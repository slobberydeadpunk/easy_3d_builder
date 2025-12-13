import fs from 'node:fs';
import path from 'node:path';

import { buildThreeSceneFromReactPlannerScene } from '../transform/build-three-scene.js';
import { exportThreeSceneToGlb } from '../transform/export-glb.js';

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error('Usage: node src/cli/export-glb.js <input.scene.json> <output.glb>');
  process.exit(1);
}

const inputAbs = path.resolve(process.cwd(), inputPath);
const outputAbs = path.resolve(process.cwd(), outputPath);

const sceneJson = JSON.parse(fs.readFileSync(inputAbs, 'utf8'));
const threeScene = buildThreeSceneFromReactPlannerScene(sceneJson);
const glb = await exportThreeSceneToGlb(threeScene);

fs.writeFileSync(outputAbs, Buffer.from(glb));
console.log(`Wrote ${outputAbs}`);
