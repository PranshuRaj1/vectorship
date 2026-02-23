// configs/textConfig.js
import { FiType } from 'react-icons/fi';

export const textConfig = {
  type: 'text',
  label: 'Text',
  icon: FiType,
  color: '#3b82f6',
  handles: {
    inputs: [],   // dynamic handles added at runtime by TextNode
    outputs: [{ id: 'output', label: 'Output', handleType: 'text' }],
  },
  fields: [],  // Text node has custom rendering (Part 3)
  customRender: true,  // flags that this node uses children instead of fields
};
