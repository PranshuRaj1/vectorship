# Frontend — VectorShift Pipeline Builder

React-based drag-and-drop pipeline builder using **ReactFlow** for the canvas and **Zustand** for state management.

## Quick Start

```bash
npm install
npm start        # → http://localhost:3000
```

> **Requires** the backend running at `http://localhost:8000` for pipeline submission.

---

## Application Flow

```
User Action                       Code Path
─────────────────────────────────────────────────────────────
1. App loads                   →  App.js renders: Toolbar + Canvas + Submit + Toast

2. Toolbar renders nodes       →  toolbar.js reads toolbarNodes from nodeRegistry.js
                                  Each entry becomes a <DraggableNode />

3. User drags a node           →  draggableNode.js: onDragStart sets nodeType
                                  in dataTransfer

4. User drops on canvas        →  ui.js: onDrop reads nodeType, calls
                                  reactFlowInstance.project() for position,
                                  getNodeID(type) from store for unique ID,
                                  addNode() to push into Zustand store

5. ReactFlow renders the node  →  nodeRegistry.js maps type → component
                                  createNode(config) wraps config in BaseNode
                                  BaseNode renders: header, fields, handles

6. User edits node fields      →  BaseNode → NodeField → onChange calls
                                  store.updateNodeField(nodeId, key, value)

7. User connects two nodes     →  ReactFlow fires onConnect → store.onConnect
                                  adds edge with smoothstep + animated arrow

8. User clicks "Submit"        →  submit.js: reads nodes/edges from store,
                                  POST to /pipelines/parse

9. Backend responds             →  submit.js dispatches CustomEvent:
                                  'pipeline-result' (success) or
                                  'pipeline-error' (failure)

10. Toast shows result          →  Toast.js listens for custom events,
                                   displays num_nodes, num_edges, is_dag,
                                   and cycle path if present
```

---

## Directory Structure

```
src/
├── App.js              # Root component — assembles Toolbar, Canvas, Submit, Toast
├── index.js             # Entry point
├── index.css            # All styles (dark theme, glassmorphism, animations)
├── store.js             # Zustand store: nodes, edges, CRUD operations
├── ui.js                # ReactFlow canvas (drop handler, MiniMap, Controls)
├── toolbar.js           # Auto-generated toolbar from nodeRegistry
├── submit.js            # Submit button — POST pipeline to backend
├── draggableNode.js     # Generic draggable node chip for toolbar
│
├── nodes/
│   ├── BaseNode.js      # Shared node layout: header, fields, handles, auto-resize
│   ├── createNode.js    # Factory: config → React component
│   ├── TextNode.js      # Custom node with dynamic {{variable}} handle detection
│   ├── nodeRegistry.js  # Central registry — single source of truth for all nodes
│   └── configs/         # One file per node type
│       ├── inputConfig.js
│       ├── outputConfig.js
│       ├── llmConfig.js
│       ├── textConfig.js
│       ├── apiConfig.js
│       ├── conditionalConfig.js
│       ├── mergeConfig.js
│       ├── timerConfig.js
│       └── noteConfig.js
│
├── components/
│   └── Toast.js         # Toast notification component
│
├── hooks/
│   └── useDebounce.js   # Debounce hook for performance
│
└── utils/
    ├── extractVariables.js  # Regex extraction of {{var}} from text
    └── handlePosition.js    # Evenly spaces multiple handles vertically
```

---

## Node Abstraction Pattern

Adding a new node requires **zero JSX** — just a config file:

### 1. Create a config

```js
// configs/myConfig.js
import { FiStar } from 'react-icons/fi';

export const myConfig = {
  type: 'myNode',
  label: 'My Node',
  icon: FiStar,
  color: '#f59e0b',
  handles: {
    inputs: [{ id: 'input', label: 'In', handleType: 'any' }],
    outputs: [{ id: 'output', label: 'Out', handleType: 'any' }],
  },
  fields: [
    { key: 'name', label: 'Name', type: 'text', defaultValue: '' },
  ],
};
```

### 2. Register it

```js
// nodeRegistry.js
import { myConfig } from './configs/myConfig';

// Add to the registry array:
{ config: myConfig, component: createNode(myConfig) },
```

That's it. The toolbar, canvas, and ReactFlow `nodeTypes` all update automatically.

### Custom Rendering

For nodes that need custom UI (like `TextNode` with dynamic variable handles), set `customRender: true` and `customComponent: TextNode` in the config. The factory will bypass `BaseNode` and use your component directly.

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **Zustand** over Redux | Lightweight, no boilerplate, works well with ReactFlow's controlled mode |
| **Config-driven nodes** | Eliminates JSX duplication; new nodes are pure data |
| **CustomEvent for toasts** | Decouples Submit from Toast — no prop drilling or shared state needed |
| **Null guard on `onDrop`** | Prevents crash if drop fires before `reactFlowInstance` is initialized |
| **Auto-resize textarea** | Text nodes dynamically grow based on content width and height |

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Dev server at `localhost:3000` |
| `npm run build` | Production build to `build/` |
| `npm test` | Jest test runner |
