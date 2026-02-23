// configs/noteConfig.js
import { FiFileText } from 'react-icons/fi';

export const noteConfig = {
  type: 'note',
  label: 'Note',
  icon: FiFileText,
  color: '#78716c',
  handles: {
    inputs: [],
    outputs: [],
  },
  fields: [
    { key: 'content', label: 'Note', type: 'textarea', defaultValue: '' },
  ],
};
