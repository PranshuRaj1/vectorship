// configs/conditionalConfig.js
import { FiGitBranch } from 'react-icons/fi';

export const conditionalConfig = {
  type: 'conditional',
  label: 'Conditional',
  icon: FiGitBranch,
  color: '#eab308',
  handles: {
    inputs: [{ id: 'input', label: 'Input', handleType: 'any' }],
    outputs: [
      { id: 'true', label: 'True', handleType: 'any' },
      { id: 'false', label: 'False', handleType: 'any' },
    ],
  },
  fields: [
    { key: 'condition', label: 'Condition', type: 'text', defaultValue: '' },
  ],
};
