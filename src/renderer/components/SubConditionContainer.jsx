import React from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import './SubConditionContainer.css';

const SubConditionContainer = ({ data, selected, id }) => {
  const subconditions = data.subconditions || [];
  const { onItemSelect } = data;

  console.log('SubConditionContainer render:', { id, hasOnItemSelect: !!onItemSelect, subconditionsCount: subconditions.length });

  // 点击容器背景（不是卡片）时不阻止传播，让 ReactFlow 处理节点选中
  const handleContainerClick = (e) => {
    console.log('SubCondition container background clicked');
  };

  // 处理卡片点击 - 选中该项进行编辑
  const handleCardClick = (e, subcond) => {
    e.stopPropagation(); // 卡片点击阻止传播，避免选中容器节点
    console.log('SubCondition card clicked:', { subcond, hasOnItemSelect: !!onItemSelect });
    if (onItemSelect) {
      console.log('Calling onItemSelect with:', id, 'subcondition', subcond);
      onItemSelect(id, 'subcondition', subcond);
    } else {
      console.warn('onItemSelect is not available!');
    }
  };

  return (
    <>
      <NodeResizer
        color="#00BCD4"
        isVisible={selected}
        minWidth={400}
        minHeight={200}
      />
      <div className="subcondition-container" onClick={handleContainerClick}>
        <div className="subcondition-container-header">
          <span className="subcondition-icon">🔀</span>
          <span className="subcondition-title">{data.label || '子条件列表 (SubConditions)'}</span>
          <span className="subcondition-count">{subconditions.length} 个条件 ({subconditions.length} conditions)</span>
        </div>

        <div className="subcondition-grid">
          {subconditions.length === 0 ? (
            <div className="subcondition-empty">
              <p>暂无子条件 (No subconditions)</p>
            </div>
          ) : (
            subconditions.map((subcond) => (
              <div 
                key={subcond.id} 
                className={`subcondition-card ${subcond.selected ? 'selected' : ''}`}
                onClick={(e) => handleCardClick(e, subcond)}
              >
                <div className="subcondition-card-header">
                  <span className="subcondition-card-icon">🔀</span>
                  <span className="subcondition-card-id">{subcond.id}</span>
                </div>
                <div className="subcondition-card-body">
                  <div className="subcondition-card-condition">
                    {subcond.condition}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 输出端口 - 供checkpoint引用 */}
        <Handle
          type="source"
          position={Position.Right}
          id="subcondition-out"
          style={{ background: '#00BCD4', width: 12, height: 12 }}
        />
      </div>
    </>
  );
};

export default SubConditionContainer;
