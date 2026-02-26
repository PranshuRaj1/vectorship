# Issues I Can Fix

## 1. DFS Cycle Path Recovery — `visited` vs `path` Desync Bug

**File:** `backend/main.py` → `check_dag()` → inner `dfs()` function (lines 97–110)

### The Problem

The DFS uses two data structures:
- `visited` (set) — nodes are added but **never removed**
- `path` (list) — nodes are added and **popped on backtrack**

The cycle-detection check does:
```python
if node in visited:
    cycle_start = path.index(node)  # 💥 ValueError if node was popped from path
    return path[cycle_start:] + [node]
```

After backtracking, a node stays in `visited` but is removed from `path`. If the DFS encounters that node again via a different branch, `path.index(node)` throws a `ValueError` because the node is no longer in `path`.

### Walkthrough

```
Step 1:  Visit A    → visited={A},     path=[A]
Step 2:  Visit B    → visited={A,B},   path=[A,B]
Step 3:  B is dead end → backtrack
                    → visited={A,B},   path=[A]     ← B still in visited!
Step 4:  Visit D    → visited={A,B,D}, path=[A,D]
Step 5:  D→B, B ∈ visited? YES
         → path.index(B) → 💥 B is NOT in path!
```

### Why It Rarely Triggers

- The DFS only runs on `remaining` nodes (those with `in_degree > 0` after Kahn's)
- These nodes are all in/connected to cycles, so cycles are found very quickly
- The DFS usually hits a cycle before needing to backtrack deeply
- Requires: dead-end branch explored first + same node encountered from a different branch

### How to Reproduce

Send a POST to `http://localhost:8000/pipelines/parse`. The bug requires the DFS to explore a dead-end branch before the cycle branch — this depends on Python's set/dict iteration order, making it hard to trigger via black-box testing alone.

**Test payloads to try** (may or may not crash depending on iteration order):

```json
{
  "nodes": [{"id": "A"}, {"id": "B"}, {"id": "C"}, {"id": "D"}],
  "edges": [
    {"source": "A", "target": "B"},
    {"source": "B", "target": "A"},
    {"source": "A", "target": "C"},
    {"source": "C", "target": "D"},
    {"source": "D", "target": "A"},
    {"source": "D", "target": "B"}
  ]
}
```

**Guaranteed reproduction:** Add a print or temporarily reorder `adj[node]` in the `dfs` function to force the dead-end branch to be explored first.

### Proposed Fix — Three-Color DFS

Replace the binary `visited` set with three states:

| Color | Meaning |
|-------|---------|
| WHITE | Not yet visited |
| GRAY  | On the current recursion stack (i.e., in `path`) |
| BLACK | Fully explored, no longer on the stack |

Only a **GRAY** node means "on my current path" → real cycle. A **BLACK** node is safe to skip.

```python
# Replace the DFS section (lines 94–112) with:
WHITE, GRAY, BLACK = 0, 1, 2
color = {nid: WHITE for nid in remaining}
path = []

def dfs(node):
    color[node] = GRAY
    path.append(node)
    for neighbor in adj[node]:
        if neighbor not in remaining:
            continue
        if color[neighbor] == GRAY:
            cycle_start = path.index(neighbor)
            return path[cycle_start:] + [neighbor]
        if color[neighbor] == WHITE:
            result = dfs(neighbor)
            if result:
                return result
    path.pop()
    color[node] = BLACK
    return None

start = next(iter(remaining))
cycle = dfs(start)
```

**Key change:** We only call `path.index(neighbor)` when `color[neighbor] == GRAY`, which guarantees the node is currently in `path`. BLACK nodes are skipped entirely — no crash, no false cycle detection.
