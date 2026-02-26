// BaseNode.js
// Shared layout component for all pipeline nodes.

import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { getHandlePosition } from '../utils/handlePosition';

const BaseNode = ({ id, data, config, children, overrideInputs, nodeStyle }) => {
  const { label, icon: Icon, color, handles } = config;

  // Use overrideInputs when provided (e.g. TextNode's dynamic variable handles),
  // otherwise fall back to static config handles.
  const inputs = overrideInputs || handles?.inputs || [];

  return (
    <div className="base-node" style={{ ...nodeStyle, '--node-color': color }}>
      {/* --- Left Handles (inputs) --- */}
      {inputs.map((h, i, arr) => (
        <Handle
          key={h.id}
          type="target"
          position={Position.Left}
          id={`${id}-${h.id}`}
          className="handle handle-input"
          style={{ top: getHandlePosition(i, arr.length) }}
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
          style={{ top: getHandlePosition(i, arr.length) }}
          data-handletype={h.handleType || 'any'}
        />
      ))}

      {/* --- Handle labels --- */}
      {inputs.map((h, i, arr) => (
        <span
          key={`label-in-${h.id}`}
          className="handle-label handle-label-left"
          style={{ top: getHandlePosition(i, arr.length) }}
        >
          {h.label}
        </span>
      ))}
      {handles?.outputs?.map((h, i, arr) => (
        <span
          key={`label-out-${h.id}`}
          className={`handle-label handle-label-${h.labelPosition || 'right'}`}
          style={{ top: getHandlePosition(i, arr.length) }}
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
  const updateNodeField = useStore((s) => s.updateNodeField);

  const value = data?.[key] ?? defaultValue ?? '';

  const handleChange = (e) => {
    updateNodeField(id, key, e.target.value);
  };

  if (type === 'select') {
    return (
      <label className="node-field">
        <span className="node-field-label">{label}</span>
        <select className="node-field-select" value={value} onChange={handleChange}>
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
          value={value}
          onChange={handleChange}
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
          value={value}
          onChange={handleChange}
        />
      </label>
    );
  }

  // Default: text input
  return (
    <label className="node-field">
      <span className="node-field-label">{label}</span>
      <input className="node-field-input" type="text" value={value} onChange={handleChange} />
    </label>
  );
};

export default BaseNode;
