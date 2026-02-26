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
  // If the config declares a custom component, use it directly
  if (config.customRender && config.customComponent) {
    const Custom = config.customComponent;
    // Wrap so the custom component receives config as a prop.
    // Safe: createNode is called once at module-load time, not per render.
    const WrappedCustom = (props) => <Custom config={config} {...props} />;
    WrappedCustom.displayName = `${config.label.replace(/\s/g, '')}Node`;
    return WrappedCustom;
  }

  const NodeComponent = (props) => (
    <BaseNode config={config} {...props} />
  );

  // Helpful for React DevTools debugging
  NodeComponent.displayName = `${config.label.replace(/\s/g, '')}Node`;

  return NodeComponent;
};
