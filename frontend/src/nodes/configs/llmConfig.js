// configs/llmConfig.js
import { FiCpu } from 'react-icons/fi';

export const llmConfig = {
  type: 'llm',
  label: 'LLM',
  icon: FiCpu,
  color: '#a855f7',
  handles: {
    inputs: [
      { id: 'system', label: 'System', handleType: 'text' },
      { id: 'prompt', label: 'Prompt', handleType: 'text' },
    ],
    outputs: [{ id: 'response', label: 'Response', handleType: 'text' }],
  },
  fields: [],  // LLM node has no user-editable fields in current spec
};
