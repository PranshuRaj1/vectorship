// submit.js
// Submit button — posts pipeline (nodes + edges) to the backend.

import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { useStore } from './store';

export const SubmitButton = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const nodes = useStore.getState().nodes;
        const edges = useStore.getState().edges;

        setLoading(true);
        try {
            const res = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);

            const data = await res.json();

            // Dispatch a custom event so the Toast component can pick it up
            window.dispatchEvent(
                new CustomEvent('pipeline-result', { detail: data })
            );
        } catch (err) {
            window.dispatchEvent(
                new CustomEvent('pipeline-error', { detail: err.message })
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="submit-area">
            <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? <span className="spinner" /> : <FiSend />}
                {loading ? 'Analyzing…' : 'Submit Pipeline'}
            </button>
        </div>
    );
};
