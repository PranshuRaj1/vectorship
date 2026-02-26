// configs/apiConfig.js
import { FiGlobe } from 'react-icons/fi';

export const apiConfig = {
  type: 'api',
  label: 'API Request',
  description: 'Make an HTTP request to an external API.',
  icon: FiGlobe,
  color: '#6366f1',
  handles: {
    inputs: [{ id: 'body', label: 'Body', handleType: 'text' }],
    outputs: [{ id: 'response', label: 'Response', handleType: 'text' }],
  },
  fields: [
    { key: 'url', label: 'URL', type: 'text', defaultValue: 'https://' },
    {
      key: 'method',
      label: 'Method',
      type: 'select',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      defaultValue: 'GET',
    },
  ],
};
