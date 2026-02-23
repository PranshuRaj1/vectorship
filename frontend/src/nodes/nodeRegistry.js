// nodeRegistry.js
// Single source of truth for all nodes in the pipeline builder.
// Adding a new node = adding a config import + one line in the registry.
// The toolbar and ReactFlow nodeTypes are auto-generated from this file.

import { createNode } from './createNode';
import TextNode from './TextNode';

// --- Config imports ---
import { inputConfig } from './configs/inputConfig';
import { outputConfig } from './configs/outputConfig';
import { llmConfig } from './configs/llmConfig';
import { textConfig } from './configs/textConfig';
import { apiConfig } from './configs/apiConfig';
import { conditionalConfig } from './configs/conditionalConfig';
import { mergeConfig } from './configs/mergeConfig';
import { timerConfig } from './configs/timerConfig';
import { noteConfig } from './configs/noteConfig';

// --- Registry: type → { component, config } ---
const registry = [
  { config: inputConfig,       component: createNode(inputConfig) },
  { config: outputConfig,      component: createNode(outputConfig) },
  { config: llmConfig,         component: createNode(llmConfig) },
  { config: textConfig,        component: TextNode },          // custom render
  { config: apiConfig,         component: createNode(apiConfig) },
  { config: conditionalConfig, component: createNode(conditionalConfig) },
  { config: mergeConfig,       component: createNode(mergeConfig) },
  { config: timerConfig,       component: createNode(timerConfig) },
  { config: noteConfig,        component: createNode(noteConfig) },
];

/**
 * nodeTypes — pass directly to <ReactFlow nodeTypes={nodeTypes} />
 * Maps type string → React component.
 */
export const nodeTypes = Object.fromEntries(
  registry.map(({ config, component }) => [config.type, component])
);

/**
 * toolbarNodes — array of { type, label, icon, color } for the toolbar.
 */
export const toolbarNodes = registry.map(({ config }) => ({
  type: config.type,
  label: config.label,
  icon: config.icon,
  color: config.color,
}));
