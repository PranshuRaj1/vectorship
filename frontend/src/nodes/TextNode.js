// TextNode.js
// Enhanced Text node with:
//   - Auto-resize textarea (width + height grow with content)
//   - Debounced variable parsing from {{ variableName }} patterns
//   - Dynamic left-side handles per unique variable
//   - Handle cleanup when variables are deleted
//   - Smooth resize transitions

import { useState, useRef, useEffect, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { FiType } from 'react-icons/fi';
import { useDebounce } from '../hooks/useDebounce';
import { extractVariables } from '../utils/extractVariables';
import { getHandlePosition } from '../utils/handlePosition';
import { useStore } from '../store';

const MIN_WIDTH = 220;
const MIN_HEIGHT = 100;

const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const textareaRef = useRef(null);
  const measureRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT });
  const updateNodeField = useStore((s) => s.updateNodeField);

  // Debounce text for variable parsing (performance)
  const debouncedText = useDebounce(currText, 300);

  // Extract unique variables from debounced text
  const variables = useMemo(
    () => extractVariables(debouncedText),
    [debouncedText]
  );

  // Auto-resize logic
  useEffect(() => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    
    // Reset to auto to get accurate scrollHeight
    el.style.height = 'auto';
    const scrollH = el.scrollHeight;
    el.style.height = `${scrollH}px`;

    // Measure text width using hidden span
    if (measureRef.current) {
      measureRef.current.textContent = currText || ' ';
      const textW = measureRef.current.scrollWidth + 40; // padding
      const newWidth = Math.max(MIN_WIDTH, Math.min(textW, 400));
      const newHeight = Math.max(MIN_HEIGHT, scrollH + 70); // header + padding
      setDimensions({ width: newWidth, height: newHeight });
    }
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
    updateNodeField(id, 'text', e.target.value);
  };

  return (
    <div
      className="base-node"
      style={{
        '--node-color': '#3b82f6',
        width: dimensions.width,
        minHeight: dimensions.height,
        transition: 'width 0.2s ease, min-height 0.2s ease',
      }}
    >
      {/* Dynamic input handles from {{ variables }} */}
      {variables.map((v, i) => (
        <Handle
          key={v}
          type="target"
          position={Position.Left}
          id={`${id}-${v}`}
          className="handle handle-input"
          style={{
            top: getHandlePosition(i, variables.length),
          }}
        />
      ))}

      {/* Handle labels (left) */}
      {variables.map((v, i) => (
        <span
          key={`label-${v}`}
          className="handle-label handle-label-left"
          style={{
            top: getHandlePosition(i, variables.length),
          }}
        >
          {v}
        </span>
      ))}

      {/* Header */}
      <div className="base-node-header">
        <FiType className="base-node-icon" />
        <span className="base-node-title">Text</span>
      </div>

      {/* Body */}
      <div className="base-node-body">
        <label className="node-field">
          <span className="node-field-label">Text</span>
          <textarea
            ref={textareaRef}
            className="node-field-textarea"
            value={currText}
            onChange={handleTextChange}
            style={{
              overflow: 'hidden',
              transition: 'height 0.2s ease',
            }}
          />
        </label>
      </div>

      {/* Hidden measurement element */}
      <span
        ref={measureRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          font: 'inherit',
          fontSize: '12px',
          padding: '0 8px',
        }}
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="handle handle-output"
        style={{ top: '50%' }}
      />
      <span
        className="handle-label handle-label-right"
        style={{ top: '50%' }}
      >
        Output
      </span>
    </div>
  );
};

export default TextNode;
