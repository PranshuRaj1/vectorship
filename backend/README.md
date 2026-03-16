# Backend — VectorShift Pipeline Builder

FastAPI backend that validates pipeline graphs submitted from the frontend.

## Quick Start

```bash
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000
```

API available at `http://localhost:8000` — verify with `GET /` → `{ "Ping": "Pong" }`.

---

## Request / Response Flow

```
Frontend (POST /pipelines/parse)
    │
    │  { nodes: [...], edges: [...] }
    ▼
┌──────────────────────────────────────────┐
│  1. Pydantic Validation                  │
│     PipelineRequest validates:           │
│       - nodes: list[NodeData]            │
│       - edges: list[EdgeData]            │
│     Extra fields are allowed (ConfigDict)│
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│  2. Count Nodes & Edges                  │
│     num_nodes = len(pipeline.nodes)      │
│     num_edges = len(pipeline.edges)      │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│  3. DAG Check — Kahn's Algorithm         │
│                                          │
│     a. Build adjacency list + in-degree  │
│        map from edges                    │
│                                          │
│     b. Enqueue all nodes with            │
│        in_degree == 0                    │
│                                          │
│     c. BFS: dequeue node, decrement      │
│        neighbors' in-degree,             │
│        enqueue if becomes 0              │
│                                          │
│     d. If visited_count == total nodes   │
│        → DAG ✅ (no cycle)               │
│        Otherwise → Cycle detected ❌      │
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│  4. Cycle Path Recovery (if cycle found) │
│                                          │
│     - Identify remaining nodes           │
│       (in_degree > 0 after Kahn's)       │
│                                          │
│     - DFS from any remaining node to     │
│       trace the actual cycle path        │
│                                          │
│     - Returns list of node IDs forming   │
│       the cycle, e.g. ["B", "C", "D", "B"]│
└──────────────┬───────────────────────────┘
               ▼
┌──────────────────────────────────────────┐
│  5. Response                             │
│     {                                    │
│       "num_nodes": 4,                    │
│       "num_edges": 5,                    │
│       "is_dag": false,                   │
│       "cycle": ["B", "C", "D", "B"]      │
│     }                                    │
└──────────────────────────────────────────┘
```

---

## File Structure

```
backend/
├── main.py             # FastAPI app, models, DAG detection, endpoints
└── test_pipeline.py    # Pytest suite (8 test cases)
```

### `main.py` Breakdown

| Section | Lines | Purpose |
|---|---|---|
| CORS middleware | 14–20 | Allows requests from `http://localhost:3000` |
| Pydantic models | 24–48 | `NodeData`, `EdgeData`, `PipelineRequest`, `PipelineResponse` |
| `check_dag()` | 52–115 | Kahn's algorithm + DFS cycle path recovery |
| `GET /` | 119–121 | Health check endpoint |
| `POST /pipelines/parse` | 124–135 | Main pipeline validation endpoint |

---

## API Endpoints

### `GET /`

Health check. Returns `{ "Ping": "Pong" }`.

### `POST /pipelines/parse`

Validates a pipeline graph.

**Request:**
```json
{
  "nodes": [
    { "id": "input-1" },
    { "id": "text-1" },
    { "id": "llm-1" },
    { "id": "output-1" }
  ],
  "edges": [
    { "source": "input-1", "target": "text-1" },
    { "source": "text-1", "target": "llm-1" },
    { "source": "llm-1", "target": "output-1" }
  ]
}
```

**Response (DAG — valid):**
```json
{
  "num_nodes": 4,
  "num_edges": 3,
  "is_dag": true,
  "cycle": null
}
```

**Response (Cycle — invalid):**
```json
{
  "num_nodes": 3,
  "num_edges": 3,
  "is_dag": false,
  "cycle": ["A", "B", "C", "A"]
}
```

---

## DAG Detection Algorithm

**Kahn's Algorithm** (topological sort via BFS):

1. Compute in-degree for every node
2. Push all zero-in-degree nodes into a queue
3. While queue is non-empty:
   - Pop a node, increment `visited_count`
   - For each neighbor, decrement their in-degree
   - If any neighbor's in-degree becomes 0, enqueue it
4. If `visited_count == total nodes` → **DAG** (no cycle)
5. Otherwise → **cycle exists** → run DFS on remaining nodes to trace the cycle path

**Time Complexity:** O(V + E) where V = nodes, E = edges.

---

## Running Tests

```bash
pip install pytest httpx
pytest test_pipeline.py -v
```

### Test Cases

| Test | Scenario | Expected |
|---|---|---|
| `test_empty_pipeline` | No nodes, no edges | `is_dag: true` |
| `test_single_node` | One node, no edges | `is_dag: true` |
| `test_linear_dag` | A → B → C | `is_dag: true` |
| `test_diamond_dag` | A → B, A → C, B → D, C → D | `is_dag: true` |
| `test_simple_cycle` | A → B → A | `is_dag: false`, cycle returned |
| `test_three_node_cycle` | A → B → C → A | `is_dag: false`, cycle returned |
| `test_self_loop` | A → A | `is_dag: false` |
| `test_dag_with_branch` | Complex multi-path DAG | `is_dag: true` |
| `test_cycle_in_larger_graph` | DAG parts + cycle | `is_dag: false`, cycle returned |

---

## CORS Configuration

The backend allows cross-origin requests from `http://localhost:3000` (the frontend dev server). To change this, modify the `allow_origins` list in `main.py`.
