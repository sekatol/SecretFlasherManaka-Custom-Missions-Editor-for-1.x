import React, { memo, useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { HandleTypes } from '../config/nodeTypes';
import './SerekaTaskNode.css';

const SerekaTaskNode = ({ data, isConnectable, selected }) => {
  const { nodeTemplate, formData = {} } = data;
  
  // 模块显示顺序状态
  const [moduleOrder, setModuleOrder] = useState(
    formData.travelFirst ? 'travelFirst' : 'conditionFirst'
  );
  
  // description 内联编辑状态
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState('');
  const descTextareaRef = useRef(null);
  
  // 交换模块顺序
  const swapModuleOrder = () => {
    const newOrder = moduleOrder === 'travelFirst' ? 'conditionFirst' : 'travelFirst';
    setModuleOrder(newOrder);
    if (data.onUpdate) {
      data.onUpdate({ ...formData, travelFirst: newOrder === 'travelFirst' });
    }
  };
  
  // 双击编辑 description
  const handleDescriptionDoubleClick = () => {
    setTempDescription(formData.description || '');
    setIsEditingDescription(true);
    setTimeout(() => {
      if (descTextareaRef.current) {
        descTextareaRef.current.focus();
        descTextareaRef.current.style.height = 'auto';
        descTextareaRef.current.style.height = descTextareaRef.current.scrollHeight + 'px';
      }
    }, 0);
  };
  
  // 保存 description
  const handleSaveDescription = () => {
    if (data.onUpdate) {
      data.onUpdate({ ...formData, description: tempDescription });
    }
    setIsEditingDescription(false);
  };
  
  // 取消编辑
  const handleCancelDescription = () => {
    setIsEditingDescription(false);
  };
  
  // 监听键盘事件
  const handleDescriptionKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSaveDescription();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelDescription();
    }
  };
  
  const getDisplayLabel = () => {
    // 优先显示用户填写的标题或描述
    if (formData.title) return formData.title;
    if (formData.description) return formData.description.substring(0, 30) + (formData.description.length > 30 ? '...' : '');
    if (formData.id) return formData.id;
    return nodeTemplate.label;
  };

  const getNodeColor = () => {
    return nodeTemplate.color || '#9E9E9E';
  };

  // 判断是否是检查点节点
  const isCheckpoint = nodeTemplate.type === 'checkpoint';
  
  // 判断是否是区域节点
  const isZone = nodeTemplate.type === 'zone';

  const getSummary = () => {
    const summary = [];
    
    // 根据不同节点类型显示不同的摘要信息
    switch (nodeTemplate.type) {
      case 'zone':
        if (formData.stage) summary.push(`场景: ${formData.stage}`);
        if (formData.r) summary.push(`半径: ${formData.r}m`);
        break;
      case 'checkpoint':
        // 按照JSON中的实际顺序显示信息
        // 如果有原始顺序信息，使用它；否则使用默认顺序
        
        // 1. 始终先显示地点引用
        if (formData.zone) summary.push(`📍 地点: ${formData.zone}`);
        
        // 2-6. 根据原始JSON顺序显示condition和travelcondition
        // 检查是否有顺序标记（从taskConverter传递）
        const hasTravelFirst = formData.travelFirst === true;
        
        if (hasTravelFirst) {
          // travelcondition 在前
          if (formData.travelDescription) {
            summary.push(`🚶 ${formData.travelDescription.substring(0, 50)}${formData.travelDescription.length > 50 ? '...' : ''}`);
          }
          if (formData.travelCondition) {
            summary.push(`🚶⚙️ 移动条件: ${formData.travelCondition}`);
          }
          
          // 然后是 condition
          if (formData.description) {
            const desc = formData.description.substring(0, 50);
            summary.push(`💬 ${desc}${formData.description.length > 50 ? '...' : ''}`);
          }
          if (formData.condition) {
            summary.push(`⚙️ 条件: ${formData.condition}`);
          }
          const timeRp = [];
          if (formData.duration !== undefined) timeRp.push(`⏱️ ${formData.duration}s`);
          if (formData.rp) timeRp.push(`💎 ${formData.rp}RP`);
          if (timeRp.length > 0) summary.push(timeRp.join(' | '));
        } else {
          // condition 在前（默认）
          if (formData.description) {
            const desc = formData.description.substring(0, 50);
            summary.push(`💬 ${desc}${formData.description.length > 50 ? '...' : ''}`);
          }
          if (formData.condition) {
            summary.push(`⚙️ 条件: ${formData.condition}`);
          }
          const timeRp = [];
          if (formData.duration !== undefined) timeRp.push(`⏱️ ${formData.duration}s`);
          if (formData.rp) timeRp.push(`💎 ${formData.rp}RP`);
          if (timeRp.length > 0) summary.push(timeRp.join(' | '));
          
          // 然后是 travelcondition
          if (formData.travelDescription) {
            summary.push(`🚶 ${formData.travelDescription.substring(0, 50)}${formData.travelDescription.length > 50 ? '...' : ''}`);
          }
          if (formData.travelCondition) {
            summary.push(`🚶⚙️ 移动条件: ${formData.travelCondition}`);
          }
        }
        
        // 7. 显示下一个检查点
        if (formData.nextcheckpoint) {
          summary.push(`➡️ 下一步: ${formData.nextcheckpoint}`);
        } else if (formData.nextSelectorType) {
          if (formData.nextSelectorType === 'SpecificId') {
            summary.push(`🎯 跳转: ${formData.nextSpecificId}`);
          } else if (formData.nextSelectorType === 'RandomId') {
            summary.push(`🎲 随机分支`);
          }
        }
        
        // 8. 显示 oncomplete 动作
        if (formData.oncomplete && formData.oncomplete.length > 0) {
          const actionTypes = formData.oncomplete.map(action => action.type).join(', ');
          summary.push(`🎬 完成动作: ${actionTypes} (${formData.oncomplete.length}个)`);
        }
        
        // 9. 显示 onviolatecondition 动作
        if (formData.onviolatecondition && formData.onviolatecondition.length > 0) {
          const actionTypes = formData.onviolatecondition.map(action => action.type).join(', ');
          summary.push(`⚠️ 违反动作: ${actionTypes} (${formData.onviolatecondition.length}个)`);
        }
        break;
      case 'dialogue':
        const lineCount = formData.lines ? formData.lines.length : 0;
        if (lineCount > 0) summary.push(`${lineCount} 条对话`);
        break;
      case 'teleport':
        if (formData.stage) summary.push(`${formData.stage}`);
        summary.push(`(${formData.x || 0}, ${formData.y || 0}, ${formData.z || 0})`);
        break;
      case 'missionInfo':
        if (formData.stage) summary.push(`场景: ${formData.stage}`);
        break;
      default:
        break;
    }
    
    return summary;
  };

  return (
    <div 
      className={`sereka-task-node ${selected ? 'selected' : ''} ${isCheckpoint ? 'checkpoint-node' : ''}`}
      style={{ borderColor: getNodeColor() }}
    >
      {/* ========== 检查点节点的句柄 ========== */}
      {isCheckpoint && (
        <>
          {/* 左侧输入句柄 - 在标题下方 */}
          <Handle
            type="target"
            position={Position.Left}
            id="in"
            isConnectable={isConnectable}
            className="node-handle handle-left"
            style={{ top: '60px', background: '#4CAF50' }}
          >
            <span className="handle-label handle-label-left">流程输入 (in)</span>
          </Handle>
          
          <Handle
            type="target"
            position={Position.Left}
            id="zone"
            isConnectable={isConnectable}
            className="node-handle handle-left"
            style={{ top: '85px', background: '#2196F3' }}
          >
            <span className="handle-label handle-label-left">地点 (zone)</span>
          </Handle>
          
          {/* 右侧输出句柄 - 在标题下方 */}
          <Handle
            type="source"
            position={Position.Right}
            id="travelcondition"
            isConnectable={isConnectable}
            className="node-handle handle-right"
            style={{ top: '60px', background: '#2196F3' }}
          >
            <span className="handle-label handle-label-right">移动条件 (travelcondition)</span>
          </Handle>
          
          <Handle
            type="source"
            position={Position.Right}
            id="condition"
            isConnectable={isConnectable}
            className="node-handle handle-right"
            style={{ top: '75px', background: '#4CAF50' }}
          >
            <span className="handle-label handle-label-right">条件 (condition)</span>
          </Handle>
          
          <Handle
            type="source"
            position={Position.Right}
            id="nextcheckpoint"
            isConnectable={isConnectable}
            className="node-handle handle-right"
            style={{ top: '90px', background: '#FF9800' }}
          >
            <span className="handle-label handle-label-right">下一检查点 (nextcheckpoint)</span>
          </Handle>
        </>
      )}
      
      {/* ========== 区域节点：输出句柄（右侧） ========== */}
      {isZone && (
        <Handle
          type="source"
          position={Position.Right}
          id={HandleTypes.ZONE_OUT}
          isConnectable={isConnectable}
          className="node-handle handle-source handle-zone-out"
          style={{ background: '#2196F3' }}
          title="连接到检查点 (Connect to Checkpoint)"
        />
      )}
      
      {/* ========== 其他节点的通用句柄 ========== */}
      {!isCheckpoint && !isZone && nodeTemplate.type !== 'missionInfo' && (
        <Handle
          type="target"
          position={Position.Top}
          id="in"
          isConnectable={isConnectable}
          className="node-handle handle-target handle-top"
        />
      )}
      
      {/* 节点头部 */}
      <div className="sereka-node-header" style={{ backgroundColor: getNodeColor() }}>
        <div className="node-icon">{nodeTemplate.icon}</div>
        <div className="node-title">{getDisplayLabel()}</div>
      </div>
      
      {/* 节点内容 */}
      <div className="sereka-node-body">
        <div className="node-type-badge">{nodeTemplate.category}</div>
        
        {/* 检查点节点的 description 内联编辑 */}
        {isCheckpoint && (
          <div className="checkpoint-description-field">
            <div className="field-label">描述 (Description)</div>
            {isEditingDescription ? (
              <textarea
                ref={descTextareaRef}
                className="field-edit-textarea"
                value={tempDescription}
                onChange={(e) => {
                  setTempDescription(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                onKeyDown={handleDescriptionKeyDown}
                placeholder="双击编辑描述... (Ctrl+Enter保存, Esc取消)"
              />
            ) : (
              <div 
                className="field-value editable"
                onDoubleClick={handleDescriptionDoubleClick}
                title="双击编辑 (Ctrl+Enter 保存, Esc 取消)"
              >
                {formData.description || '(空)'}
              </div>
            )}
          </div>
        )}
        
        {/* 检查点卡片的顺序调整按钮 */}
        {isCheckpoint && (
          <div className="module-order-controls">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                swapModuleOrder();
              }}
              className="swap-order-button"
              title={moduleOrder === 'travelFirst' ? '当前：TravelCondition在前，点击切换为Condition在前' : '当前：Condition在前，点击切换为TravelCondition在前'}
            >
              ↕️ {moduleOrder === 'travelFirst' ? 'Travel优先' : 'Condition优先'}
            </button>
          </div>
        )}
        
        {getSummary().length > 0 && (
          <div className="node-summary">
            {getSummary().map((item, index) => (
              <div key={index} className="summary-item">{item}</div>
            ))}
          </div>
        )}

        {/* 显示ID */}
        {formData.id && (
          <div className="node-id">ID: {formData.id}</div>
        )}
        
        {/* 编辑提示 */}
        <div className="edit-hint">点击节点在右侧编辑</div>
      </div>
      
      {/* ========== 其他节点的通用输出句柄（底部） ========== */}
      {!isCheckpoint && nodeTemplate.type !== 'end' && !isZone && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="out"
          isConnectable={isConnectable}
          className="node-handle handle-source handle-bottom"
        />
      )}
    </div>
  );
};

export default memo(SerekaTaskNode);
