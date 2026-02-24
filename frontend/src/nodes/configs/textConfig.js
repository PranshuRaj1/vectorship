// configs/textConfig.js
import { FiType } from 'react-icons/fi';
import TextNode from '../TextNode';

export const textConfig = {
  type: 'text',
  label: 'Text',
  icon: FiType,
  color: '#3b82f6',
  handles: {
    inputs: [],   // dynamic handles added at runtime by TextNode
    outputs: [{ id: 'output', label: 'Output', handleType: 'text' }],
  },
  fields: [],
  customRender: true,
  customComponent: TextNode,
};
