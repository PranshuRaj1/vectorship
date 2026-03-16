# VectorShift Pipeline Builder

A full-stack, drag-and-drop pipeline builder for designing and validating node-based workflows. Built as an assignment for VectorShift.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)
![ReactFlow](https://img.shields.io/badge/ReactFlow-11.8-ff0072)
![Python](https://img.shields.io/badge/Python-3.10+-3776ab?logo=python)

---

## Overview

Users build pipelines visually by dragging nodes onto a canvas, connecting them with edges, and submitting the graph to a backend that validates it. The backend counts nodes/edges and checks whether the pipeline forms a valid **Directed Acyclic Graph (DAG)** using **Kahn's algorithm**, returning cycle details if one is found.

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                     Frontend                         │
│  React + ReactFlow + Zustand                         │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │ Toolbar  │→ │  Canvas (UI) │→ │ Submit Button │   │
│  │ (drag)   │  │  (drop/wire) │  │ (POST /parse) │   │
│  └──────────┘  └──────────────┘  └───────┬───────┘   │
└──────────────────────────────────────────┼───────────┘
                                           │ HTTP POST
┌──────────────────────────────────────────┼───────────┐
│                     Backend              ▼           │
│  FastAPI                                             │
│                                                      │
│  /pipelines/parse                                    │
│    → Count nodes & edges                             │
│    → Kahn's algorithm (DAG check)                    │
│    → Return { num_nodes, num_edges, is_dag, cycle }  │
└──────────────────────────────────────────────────────┘
```

## Key Features

| Feature | Description |
|---|---|
| **Drag & Drop Nodes** | 9 node types: Input, Output, LLM, Text, API, Conditional, Merge, Timer, Note |
| **Node Abstraction** | Config-driven factory (`createNode`) — add a new node by adding a config file |
| **Text Variables** | Text node auto-detects `{{variable}}` patterns and creates dynamic input handles |
| **DAG Validation** | Backend uses Kahn's algorithm with cycle path recovery |
| **Toast Notifications** | Visual feedback showing node/edge counts, DAG status, and cycle paths |
| **Responsive Canvas** | MiniMap, Controls, snap-to-grid, smooth-step edge animations |

## Project Structure

```
assign/
├── frontend/          # React app (Create React App)
│   └── src/
│       ├── nodes/     # Node abstraction: BaseNode, createNode, configs
│       ├── components/# Reusable UI components (Toast)
│       ├── hooks/     # Custom hooks (useDebounce)
│       ├── utils/     # Utilities (extractVariables, handlePosition)
│       ├── ui.js      # ReactFlow canvas
│       ├── toolbar.js # Draggable node toolbar
│       ├── submit.js  # Submit pipeline to backend
│       └── store.js   # Zustand state management
│
├── backend/           # FastAPI server
│   ├── main.py        # API endpoints + DAG detection (Kahn's algorithm)
│   └── test_pipeline.py # Pytest test suite
│
└── README.md          # ← You are here
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 16 and **npm**
- **Python** ≥ 3.10 and **pip**

### 1. Start the Backend

```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Verify with `GET /` → `{ "Ping": "Pong" }`.

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

### 3. Use the App

1. **Drag** nodes from the toolbar onto the canvas
2. **Connect** nodes by drawing edges between handles
3. **Configure** node fields (model selection, text input, etc.)
4. **Submit** the pipeline → backend validates and returns results via toast notification

## API Reference

### `POST /pipelines/parse`

**Request Body:**
```json
{
  "nodes": [{ "id": "input-1" }, { "id": "llm-1" }],
  "edges": [{ "source": "input-1", "target": "llm-1" }]
}
```

**Response:**
```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true,
  "cycle": null
}
```

If a cycle is detected, `is_dag` will be `false` and `cycle` will contain the node IDs forming the cycle path.

## Running Tests

```bash
cd backend
pip install pytest httpx
pytest test_pipeline.py -v
```

The test suite covers: empty pipelines, single nodes, linear DAGs, diamond DAGs, simple cycles, three-node cycles, self-loops, branching DAGs, and cycles within larger graphs.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, ReactFlow 11.8, Zustand, react-icons |
| **Backend** | FastAPI, Pydantic, Python 3.10+ |
| **Testing** | Pytest, FastAPI TestClient |
| **Styling** | Vanilla CSS (dark theme, glassmorphism, micro-animations) |
