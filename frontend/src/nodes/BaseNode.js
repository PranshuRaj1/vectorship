// BaseNode.js
// Shared layout component for all pipeline nodes.

import { Handle, Position } from 'reactflow';

const BaseNode = ({ id, data, config, children }) => {
  const { label, icon: Icon, color, handles } = config;

  return (
    <div className="base-node" style={{ '--node-color': color }}>
      {/* --- Left Handles (inputs) --- */}
      {handles?.inputs?.map((h, i, arr) => (
        <Handle
          key={h.id}
          type="target"
          position={Position.Left}
          id={`${id}-${h.id}`}
          className="handle handle-input"
          style={{ top: `${((i + 1) / (arr.length + 1)) * 100}%` }}
          data-handletype={h.handleType || 'any'}
        />
      ))}

      {/* --- Header --- */}
      <div className="base-node-header">
        {Icon && <Icon className="base-node-icon" />}
        <span className="base-node-title">{label}</span>
      </div>

      {/* --- Body --- */}
      <div className="base-node-body">
        {children
          ? children
          : config.fields?.map((field) => (
              <NodeField key={field.key} field={field} id={id} data={data} />
            ))}
      </div>

      {/* --- Right Handles (outputs) --- */}
      {handles?.outputs?.map((h, i, arr) => (
        <Handle
          key={h.id}
          type="source"
          position={Position.Right}
          id={`${id}-${h.id}`}
          className="handle handle-output"
          style={{ top: `${((i + 1) / (arr.length + 1)) * 100}%` }}
          data-handletype={h.handleType || 'any'}
        />
      ))}

      {/* --- Handle labels --- */}
      {handles?.inputs?.map((h, i, arr) => (
        <span
          key={`label-in-${h.id}`}
          className="handle-label handle-label-left"
          style={{ top: `${((i + 1) / (arr.length + 1)) * 100}%` }}
        >
          {h.label}
        </span>
      ))}
      {handles?.outputs?.map((h, i, arr) => (
        <span
          key={`label-out-${h.id}`}
          className="handle-label handle-label-right"
          style={{ top: `${((i + 1) / (arr.length + 1)) * 100}%` }}
        >
          {h.label}
        </span>
      ))}
    </div>
  );
};

/* ---------- Generic Field Renderer ---------- */
const NodeField = ({ field, id, data }) => {
  const { key, label, type, options, defaultValue } = field;

  const value = data?.[key] ?? defaultValue ?? '';

  if (type === 'select') {
    return (
      <label className="node-field">
        <span className="node-field-label">{label}</span>
        <select className="node-field-select" defaultValue={value}>
          {options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (type === 'textarea') {
    return (
      <label className="node-field">
        <span className="node-field-label">{label}</span>
        <textarea
          className="node-field-textarea"
          defaultValue={value}
          rows={2}
        />
      </label>
    );
  }

  if (type === 'number') {
    return (
      <label className="node-field">
        <span className="node-field-label">{label}</span>
        <input
          className="node-field-input"
          type="number"
          defaultValue={value}
        />
      </label>
    );
  }

  // Default: text input
  return (
    <label className="node-field">
      <span className="node-field-label">{label}</span>
      <input className="node-field-input" type="text" defaultValue={value} />
    </label>
  );
};

export default BaseNode;
