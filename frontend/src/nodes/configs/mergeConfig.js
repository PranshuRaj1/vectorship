// configs/mergeConfig.js
import { FiLayers } from 'react-icons/fi';

export const mergeConfig = {
  type: 'merge',
  label: 'Merge',
  icon: FiLayers,
  color: '#14b8a6',
  handles: {
    inputs: [
      { id: 'input_1', label: 'In 1', handleType: 'any' },
      { id: 'input_2', label: 'In 2', handleType: 'any' },
      { id: 'input_3', label: 'In 3', handleType: 'any' },
    ],
    outputs: [{ id: 'merged', label: 'Merged', handleType: 'any' }],
  },
  fields: [
    {
      key: 'strategy',
      label: 'Strategy',
      type: 'select',
      options: ['Concatenate', 'First Non-Empty', 'Array'],
      defaultValue: 'Concatenate',
    },
  ],
};
