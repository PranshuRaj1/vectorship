// toolbar.js
// Auto-generates draggable nodes from the registry.

import { DraggableNode } from './draggableNode';
import { toolbarNodes } from './nodes/nodeRegistry';

export const PipelineToolbar = () => {
    return (
        <div className="pipeline-toolbar">
            <div className="toolbar-inner">
                <span className="toolbar-title">Nodes</span>
                {toolbarNodes.map((node) => (
                    <DraggableNode
                        key={node.type}
                        type={node.type}
                        label={node.label}
                        icon={node.icon}
                        color={node.color}
                    />
                ))}
            </div>
        </div>
    );
};
