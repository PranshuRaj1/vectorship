// configs/noteConfig.js
import { FiFileText } from 'react-icons/fi';

export const noteConfig = {
  type: 'note',
  label: 'Note',
  description: 'Add a note to the canvas for documentation.',
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
