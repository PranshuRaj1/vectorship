// draggableNode.js

export const DraggableNode = ({ type, label, icon: Icon, color }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType };
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className="draggable-node"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
          {Icon && <Icon className="node-icon" style={{ color: color || 'inherit' }} />}
          <span>{label}</span>
      </div>
    );
  };