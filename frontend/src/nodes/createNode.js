// createNode.js
// Factory function: config → React component.
// Zero JSX duplication — add a new node by adding a config object.

import BaseNode from './BaseNode';

/**
 * createNode(config)
 *
 * Accepts a node config object and returns a React component
 * that can be registered with ReactFlow.
 *
 * @param {object} config  - { type, label, icon, color, handles, fields }
 * @returns {React.FC}     - A ReactFlow-compatible node component
 */
export const createNode = (config) => {
  const NodeComponent = (props) => (
    <BaseNode config={config} {...props} />
  );

  // Helpful for React DevTools debugging
  NodeComponent.displayName = `${config.label.replace(/\s/g, '')}Node`;

  return NodeComponent;
};
