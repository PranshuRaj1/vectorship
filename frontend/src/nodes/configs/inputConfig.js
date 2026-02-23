// configs/inputConfig.js
import { FiDownload } from 'react-icons/fi';

export const inputConfig = {
  type: 'customInput',
  label: 'Input',
  icon: FiDownload,
  color: '#22c55e',
  handles: {
    inputs: [],
    outputs: [{ id: 'value', label: 'Value', handleType: 'text' }],
  },
  fields: [
    { key: 'inputName', label: 'Name', type: 'text', defaultValue: '' },
    {
      key: 'inputType',
      label: 'Type',
      type: 'select',
      options: ['Text', 'File'],
      defaultValue: 'Text',
    },
  ],
};
