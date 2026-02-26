// configs/inputConfig.js
import { FiDownload } from 'react-icons/fi';

export const inputConfig = {
  type: 'customInput',
  label: 'Input',
  description: 'Pass data of different types into your workflow.',
  icon: FiDownload,
  color: '#22c55e',
  handles: {
    inputs: [],
    outputs: [{ id: 'value', label: 'Value', handleType: 'text', labelPosition: 'left' }],
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
