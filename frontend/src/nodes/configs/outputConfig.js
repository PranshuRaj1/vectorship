// configs/outputConfig.js
import { FiUpload } from 'react-icons/fi';

export const outputConfig = {
  type: 'customOutput',
  label: 'Output',
  description: 'Output data of different types from your workflow.',
  icon: FiUpload,
  color: '#f97316',
  handles: {
    inputs: [{ id: 'value', label: 'Value', handleType: 'text' }],
    outputs: [],
  },
  fields: [
    { key: 'outputName', label: 'Name', type: 'text', defaultValue: '' },
    {
      key: 'outputType',
      label: 'Type',
      type: 'select',
      options: ['Text', 'Image'],
      defaultValue: 'Text',
    },
  ],
};
