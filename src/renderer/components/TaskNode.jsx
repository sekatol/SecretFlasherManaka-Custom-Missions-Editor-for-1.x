import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './TaskNode.css';

const TaskNode = ({ data, isConnectable }) => {
  const getNodeColor = (taskType) => {
    switch (taskType) {
      case 'start':
        return '#4CAF50';
      case 'action':
        return '#2196F3';
      case 'condition':
        return '#FF9800';
      case 'end':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <div className="task-node" style={{ borderColor: getNodeColor(data.taskType) }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="node-handle"
      />
      
      <div className="node-header" style={{ backgroundColor: getNodeColor(data.taskType) }}>
        <div className="node-title">{data.label}</div>
      </div>
      
      <div className="node-body">
        <div className="node-type">{data.taskType}</div>
        {data.description && (
          <div className="node-description">{data.description}</div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="node-handle"
      />
    </div>
  );
};

export default memo(TaskNode);
