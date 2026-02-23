// configs/timerConfig.js
import { FiClock } from 'react-icons/fi';

export const timerConfig = {
  type: 'timer',
  label: 'Timer',
  icon: FiClock,
  color: '#ec4899',
  handles: {
    inputs: [{ id: 'trigger', label: 'Trigger', handleType: 'any' }],
    outputs: [{ id: 'done', label: 'Done', handleType: 'any' }],
  },
  fields: [
    { key: 'delay', label: 'Delay (s)', type: 'number', defaultValue: '1' },
  ],
};
