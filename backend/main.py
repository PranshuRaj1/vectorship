# main.py
# FastAPI backend for the VectorShift pipeline builder.
# Parses pipeline data, counts nodes/edges, and checks for DAG using Kahn's algorithm.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from typing import Any, Optional
from collections import defaultdict, deque

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Models ---
class NodeData(BaseModel):
    id: str
    type: Optional[str] = None
    data: Optional[dict[str, Any]] = None
    position: Optional[dict[str, Any]] = None
    model_config = ConfigDict(extra="allow")


class EdgeData(BaseModel):
    source: str
    target: str
    id: Optional[str] = None
    model_config = ConfigDict(extra="allow")


class PipelineRequest(BaseModel):
    nodes: list[NodeData]
    edges: list[EdgeData]


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool
    cycle: Optional[list[str]] = None


# --- DAG Detection (Kahn's Algorithm + Cycle Path Recovery) ---
def check_dag(nodes: list[NodeData], edges: list[EdgeData]) -> tuple[bool, list[str] | None]:
    """
    Uses Kahn's algorithm (topological sort via BFS) to detect if the graph is a DAG.
    If a cycle exists, traces back through remaining edges to find the cycle path.

    Returns: (is_dag, cycle_path_or_None)
    """
    node_ids = {n.id for n in nodes}
    in_degree = defaultdict(int)
    adj = defaultdict(list)

    for nid in node_ids:
        in_degree[nid] = 0

    for edge in edges:
        adj[edge.source].append(edge.target)
        in_degree[edge.target] += 1

    # BFS with zero in-degree nodes
    queue = deque([nid for nid in node_ids if in_degree[nid] == 0])
    visited_count = 0

    while queue:
        node = queue.popleft()
        visited_count += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    if visited_count == len(node_ids):
        return True, None

    # --- Cycle found — trace it ---
    # Remaining nodes (in_degree > 0) are part of/connected to cycles
    remaining = {nid for nid in node_ids if in_degree[nid] > 0}

    if not remaining:
        return False, None

    # DFS from any remaining node to find the actual cycle
    start = next(iter(remaining))
    visited = set()
    path = []

    def dfs(node):
        if node in path:
            # Found cycle — extract it
            cycle_start = path.index(node)
            return path[cycle_start:] + [node]
        if node in visited:
            return None
        visited.add(node)
        path.append(node)
        for neighbor in adj[node]:
            if neighbor in remaining:
                result = dfs(neighbor)
                if result:
                    return result
        path.pop()
        return None

    cycle = dfs(start)
    return False, cycle


# --- Endpoints ---
@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineRequest) -> PipelineResponse:
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    is_dag, cycle = check_dag(pipeline.nodes, pipeline.edges)

    return PipelineResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=is_dag,
        cycle=cycle,
    )
