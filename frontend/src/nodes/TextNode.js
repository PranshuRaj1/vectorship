// TextNode.js
// Enhanced Text node that composes BaseNode for consistent styling.
// Custom behavior:
//   - Auto-resize textarea (width + height grow with content)
//   - Debounced variable parsing from {{ variableName }} patterns
//   - Dynamic left-side handles per unique variable (via overrideInputs)
//   - Handle cleanup when variables are deleted

import { useState, useRef, useEffect, useMemo } from 'react';
import BaseNode from './BaseNode';
import { useDebounce } from '../hooks/useDebounce';
import { extractVariables } from '../utils/extractVariables';
import { useStore } from '../store';

const MIN_WIDTH = 220;
const MIN_HEIGHT = 100;

const TextNode = ({ id, data, config }) => {
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

  // Clean up orphaned edges when variables are removed
  useEffect(() => {
    const { edges, onEdgesChange } = useStore.getState();
    const validHandleIds = new Set(variables.map((v) => `${id}-${v}`));

    const edgesToRemove = edges
      .filter((e) => e.target === id && e.targetHandle && !validHandleIds.has(e.targetHandle) && e.targetHandle !== `${id}-output`)
      .map((e) => ({ id: e.id, type: 'remove' }));

    if (edgesToRemove.length > 0) {
      onEdgesChange(edgesToRemove);
    }
  }, [variables, id]);

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

  // Map variables to the handle format BaseNode expects
  const dynamicHandles = variables.map((v) => ({ id: v, label: v }));

  return (
    <BaseNode
      id={id}
      data={data}
      config={config}
      overrideInputs={dynamicHandles}
      nodeStyle={{
        width: dimensions.width,
        minHeight: dimensions.height,
        transition: 'width 0.2s ease, min-height 0.2s ease',
      }}
    >
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

      {/* Hidden measurement element for auto-resize width calculation */}
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
    </BaseNode>
  );
};

export default TextNode;
