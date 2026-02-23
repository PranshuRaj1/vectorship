# test_pipeline.py
# Tests for the /pipelines/parse endpoint — DAG detection + cycle path.

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def post_pipeline(nodes, edges):
    """Helper to post a pipeline and return the JSON response."""
    return client.post(
        "/pipelines/parse",
        json={"nodes": nodes, "edges": edges},
    ).json()


def make_nodes(*ids):
    return [{"id": nid} for nid in ids]


def make_edges(*pairs):
    return [{"source": s, "target": t, "id": f"{s}-{t}"} for s, t in pairs]


# --- Basic cases ---

def test_empty_pipeline():
    result = post_pipeline([], [])
    assert result["num_nodes"] == 0
    assert result["num_edges"] == 0
    assert result["is_dag"] is True


def test_single_node():
    result = post_pipeline(make_nodes("A"), [])
    assert result["num_nodes"] == 1
    assert result["num_edges"] == 0
    assert result["is_dag"] is True


def test_linear_dag():
    """A → B → C is a valid DAG."""
    result = post_pipeline(
        make_nodes("A", "B", "C"),
        make_edges(("A", "B"), ("B", "C")),
    )
    assert result["num_nodes"] == 3
    assert result["num_edges"] == 2
    assert result["is_dag"] is True
    assert result["cycle"] is None


def test_diamond_dag():
    """A → B, A → C, B → D, C → D is a valid DAG."""
    result = post_pipeline(
        make_nodes("A", "B", "C", "D"),
        make_edges(("A", "B"), ("A", "C"), ("B", "D"), ("C", "D")),
    )
    assert result["is_dag"] is True


# --- Cycle cases ---

def test_simple_cycle():
    """A → B → A is a cycle."""
    result = post_pipeline(
        make_nodes("A", "B"),
        make_edges(("A", "B"), ("B", "A")),
    )
    assert result["is_dag"] is False
    assert result["cycle"] is not None
    assert len(result["cycle"]) >= 2


def test_three_node_cycle():
    """A → B → C → A."""
    result = post_pipeline(
        make_nodes("A", "B", "C"),
        make_edges(("A", "B"), ("B", "C"), ("C", "A")),
    )
    assert result["is_dag"] is False
    assert result["cycle"] is not None


def test_self_loop():
    """A → A."""
    result = post_pipeline(
        make_nodes("A"),
        make_edges(("A", "A")),
    )
    assert result["is_dag"] is False


def test_dag_with_branch():
    """Complex DAG with multiple paths — no cycles."""
    result = post_pipeline(
        make_nodes("input-1", "text-1", "llm-1", "output-1"),
        make_edges(
            ("input-1", "text-1"),
            ("text-1", "llm-1"),
            ("input-1", "llm-1"),
            ("llm-1", "output-1"),
        ),
    )
    assert result["num_nodes"] == 4
    assert result["num_edges"] == 4
    assert result["is_dag"] is True


def test_cycle_in_larger_graph():
    """Graph has both DAG parts and a cycle."""
    result = post_pipeline(
        make_nodes("A", "B", "C", "D", "E"),
        make_edges(("A", "B"), ("B", "C"), ("C", "D"), ("D", "B"), ("A", "E")),
    )
    assert result["is_dag"] is False
    assert result["cycle"] is not None
