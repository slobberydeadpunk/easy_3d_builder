# AGENTS.md

## Project overview
react-planner is a React + Redux + Immutable.js component for drawing 2D floorplans and viewing them in 3D. The public API is exported from `src/index.js`.

## Key directories
- `src/`: library source (actions, reducers, models, UI components, catalog).
- `demo/`: demo app and webpack config; built output goes to `demo/dist`.
- `docs/`: how-to guides for catalog, elements, properties, plugins.
- `scripts/`: build tooling used by npm scripts.
- `lib/` and `es/`: generated builds (CommonJS and ES modules).

## Architecture notes
- `src/react-planner.jsx` is the main connected component; it initializes plugins, loads the catalog, and renders toolbar/content/sidebar/footer.
- `src/models.js` defines Immutable Records (`State`, `Scene`, `Layer`, `Line`, `Area`, `Item`, etc.). Update these when adding new state.
- `src/reducers/reducer.js` routes actions to domain reducers by action type groupings from `src/constants.js`.
- `src/actions/` defines action creators; `src/reducers/` and `src/class/` implement domain behavior.
- `src/catalog/` and `src/catalog/factories/` define catalog structure and element factories.
- `src/components/` and `src/styles/` hold UI and styling; `src/shared-style.js` exports shared theme tokens.
- `src/plugins/` provides plugin hooks; see `docs/HOW_TO_CREATE_A_PLUGIN.md`.
- `src/translator/` holds i18n helpers.
- `demo/src/ui/toolbar-export-glb-button.jsx` triggers browser-side GLB export via Three.js GLTFExporter and performs plan sanitization before export.
- `src/components/viewer3d/scene-creator.js` builds the 3D plan and keeps bounding boxes updated to avoid culling issues.
- `poc-server/src/transform/export-glb.js` handles server-side GLB export and geometry normalization when browser export is unavailable.

## Development workflow
- Install: `npm install`
- Run demo: `npm start` (webpack dev server on port 9000).
- Build demo: `npm run build-demo` -> `demo/dist`.
- Build library: `npm run build-es` (to `es/`) and `npm run build-commonjs` (to `lib/`).
- Full build: `npm run build` (clean + demo + library builds).
- Tests: none provided (`npm test` exits 1).

## Conventions and guardrails
- Prefer updating source in `src/`; avoid editing generated `lib/`, `es/`, or `demo/dist` directly.
- If you add new action types, update `src/constants.js` and ensure the relevant reducer handles them.
- When extending state, update the Immutable Records in `src/models.js` and ensure serialization/deserialization stays consistent.
- For GLB export changes, keep browser-side and server-side pipelines aligned to avoid divergent mesh validation behavior.

## GLB export flow
- Browser export: `demo/src/ui/toolbar-export-glb-button.jsx` uses GLTFExporter with embedded images for the preview/download action.
- Export sanitization: `sanitizePlanForExport()` normalizes matrices, ensures matrix updates, and generates tangents for meshes that use normal maps.
- Backend export: `poc-server/src/transform/export-glb.js` exports GLB from server-side processing and includes tangent generation and fallback handling for empty scenes.

## Reference docs
- `docs/HOW_TO_CREATE_A_CATALOG.md`
- `docs/HOW_TO_CREATE_AN_ELEMENT.md`
- `docs/HOW_TO_CREATE_A_PROPERTY.md`
- `docs/HOW_TO_CREATE_A_PLUGIN.md`
