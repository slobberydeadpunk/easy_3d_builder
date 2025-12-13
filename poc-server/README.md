# react-planner → GLB Export PoC

This is a standalone Node.js service that converts a `react-planner` project (scene JSON) into a `.glb`.

## Prerequisites

- Node.js >= 18

## Install

```bash
cd poc-server
npm i
```

## Run server

```bash
npm run start
```

Then POST a scene JSON to:

- `POST http://localhost:3100/export/glb`

If you want textures embedded in the GLB, send a wrapper payload:

```json
{
  "scene": { "...": "react-planner scene json" },
  "texturesByType": {
    "wall": {
      "bricks": {
        "uri": "http://localhost:9000/catalog/lines/wall/textures/bricks.jpg",
        "lengthRepeatScale": 0.01,
        "heightRepeatScale": 0.01,
        "normal": {
          "uri": "http://localhost:9000/catalog/lines/wall/textures/bricks-normal.jpg",
          "normalScaleX": 0.8,
          "normalScaleY": 0.8
        }
      }
    }
  }
}
```

## CLI (optional)

```bash
node src/cli/export-glb.js input.scene.json output.glb
```
