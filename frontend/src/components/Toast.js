// Toast.js
// Styled toast notification component.
// Listens for pipeline-result and pipeline-error custom events.

import { useState, useEffect, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    // Auto-dismiss after 6 seconds
    setTimeout(() => removeToast(id), 6000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, closing: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250); // match exit animation
  };

  useEffect(() => {
    const handleResult = (e) => {
      const { num_nodes, num_edges, is_dag, cycle } = e.detail;
      addToast({
        type: is_dag ? 'success' : 'error',
        title: is_dag ? 'Valid DAG Pipeline' : 'Not a DAG — Cycle Detected',
        message: `Nodes: ${num_nodes} · Edges: ${num_edges}${
          !is_dag && cycle ? `\nCycle: ${cycle.join(' → ')}` : ''
        }`,
      });
    };

    const handleError = (e) => {
      addToast({
        type: 'error',
        title: 'Connection Error',
        message: e.detail || 'Failed to reach the backend. Is the server running?',
      });
    };

    window.addEventListener('pipeline-result', handleResult);
    window.addEventListener('pipeline-error', handleError);
    return () => {
      window.removeEventListener('pipeline-result', handleResult);
      window.removeEventListener('pipeline-error', handleError);
    };
  }, [addToast]);

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}${t.closing ? ' toast-closing' : ''}`}
        >
          <span className="toast-icon">
            {t.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          </span>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            <div className="toast-message">{t.message}</div>
          </div>
          <button className="toast-close" onClick={() => removeToast(t.id)}>
            <FiX />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
