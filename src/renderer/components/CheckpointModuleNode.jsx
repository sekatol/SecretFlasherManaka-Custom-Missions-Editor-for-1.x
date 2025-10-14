import React, { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, useNodes } from 'reactflow';
import { CosplayParts, AdultToyParts, CoatStates, ConditionExpressions } from '../config/actionLibrary';
import './CheckpointModuleNode.css';

// 辅助函数：将条件代码转换为中文标签
const formatConditionDisplay = (condition, subconditions = []) => {
  if (!condition) return '';
  
  // 检查是否是 SubCondition_ 引用
  if (condition.startsWith('SubCondition_')) {
    const subCondId = condition.replace('SubCondition_', '');
    const subCond = subconditions.find(sc => sc.id === subCondId);
    if (subCond && subCond.condition) {
      // 递归处理子条件的 condition
      return `子条件[${subCondId}]: ${formatConditionDisplay(subCond.condition, subconditions)}`;
    } else {
      return `${condition} (未找到定义)`;
    }
  }
  
  // 如果是数组格式 [xxx, yyy]
  if (condition.startsWith('[') && condition.endsWith(']')) {
    try {
      const codes = condition.slice(1, -1).split(',').map(s => s.trim());
      const labels = codes.map(code => {
        // 处理否定前缀 !
        const isNegated = code.startsWith('!');
        const cleanCode = isNegated ? code.substring(1) : code;
        const prefix = isNegated ? '!' : '';
        
        // 查找服装部件
        const cosplayPart = CosplayParts.find(p => p.id === cleanCode);
        if (cosplayPart) return prefix + cosplayPart.name;
        
        // 查找玩具部件
        const toyPart = AdultToyParts.find(p => p.id === cleanCode);
        if (toyPart) return prefix + toyPart.name;
        
        // 查找外套状态
        const coatState = CoatStates.find(s => s.id === cleanCode);
        if (coatState) return prefix + coatState.name;
        
        // 查找条件表达式
        const condExpr = ConditionExpressions.find(e => e.id === cleanCode);
        if (condExpr) return prefix + condExpr.name;
        
        // 未找到则返回原代码
        return code;
      });
      return labels.join(', ');
    } catch (e) {
      return condition;
    }
  }
  
  // 如果是单个条件代码
  const cosplayPart = CosplayParts.find(p => p.id === condition);
  if (cosplayPart) return cosplayPart.name;
  
  const toyPart = AdultToyParts.find(p => p.id === condition);
  if (toyPart) return toyPart.name;
  
  const coatState = CoatStates.find(s => s.id === condition);
  if (coatState) return coatState.name;
  
  const condExpr = ConditionExpressions.find(e => e.id === condition);
  if (condExpr) return condExpr.name;
  
  // 未找到则返回原值
  return condition;
};

/**
 * 检查点模块节点组件
 * 用于显示 condition 和 travelcondition 模块
 */
const CheckpointModuleNode = ({ data, isConnectable, selected }) => {
  const { nodeType, formData = {} } = data;
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(formData.description || '');
  const textareaRef = useRef(null);
  
  // 从 ReactFlow 获取所有节点，查找 subConditionContainer
  const allNodes = useNodes();
  const subCondContainer = allNodes.find(n => n.type === 'subConditionContainer');
  const subconditions = subCondContainer?.data?.subconditions || [];
  
  const isConditionModule = nodeType === 'checkpoint_condition';
  const isTravelConditionModule = nodeType === 'checkpoint_travelcondition';
  
  // 自动聚焦和选中文本
  useEffect(() => {
    if (isEditingDescription && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditingDescription]);
  
  // 保存 description
  const handleSaveDescription = () => {
    setIsEditingDescription(false);
    if (data.onUpdate) {
      data.onUpdate({ ...formData, description: editedDescription });
    }
  };
  
  // 键盘事件处理
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setEditedDescription(formData.description || '');
      setIsEditingDescription(false);
    }
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveDescription();
    }
  };
  
  const getDisplayContent = () => {
    if (isConditionModule) {
      // 解析 itemconditions
      let itemconditionsDisplay = '';
      if (formData.itemconditions) {
        try {
          const itemconds = typeof formData.itemconditions === 'string' 
            ? JSON.parse(formData.itemconditions) 
            : formData.itemconditions;
          if (Array.isArray(itemconds) && itemconds.length > 0) {
            itemconditionsDisplay = itemconds.map(ic => `${ic.type}@${ic.zone || '任意'}`).join(', ');
          }
        } catch (e) {
          itemconditionsDisplay = formData.itemconditions;
        }
      }
      
      // 格式化条件显示 - 传入 subconditions 参数
      const conditionDisplay = formatConditionDisplay(formData.condition, subconditions);
      
      return {
        icon: '✓',
        title: '条件 (Condition)',
        color: '#4CAF50',
        fields: [
          { label: '描述 (Description)', value: formData.description, multiline: true },
          { label: '条件 (Condition)', value: conditionDisplay || formData.condition, highlight: !!conditionDisplay },
          { label: '物品条件 (ItemConditions)', value: itemconditionsDisplay, highlight: !!itemconditionsDisplay },
          { label: '时长 (Duration)', value: formData.duration ? `${formData.duration}秒` : undefined },
          { label: 'RP奖励 (RP)', value: formData.rp || undefined },
          { label: '重置 (Reset)', value: formData.reset !== undefined ? (formData.reset ? '是' : '否') : undefined },
          { label: '隐藏面板 (HidePanel)', value: formData.hidepanel || undefined }
        ].filter(f => f.value !== undefined && f.value !== '' && f.value !== null)
      };
    } else if (isTravelConditionModule) {
      // 格式化条件显示 - 传入 subconditions 参数
      const conditionDisplay = formatConditionDisplay(formData.condition, subconditions);
      
      return {
        icon: '🚶',
        title: '移动条件 (TravelCondition)',
        color: '#2196F3',
        fields: [
          { label: '移动描述 (Description)', value: formData.description, multiline: true },
          { label: '移动条件 (Condition)', value: conditionDisplay || formData.condition, highlight: !!conditionDisplay },
          { label: '隐藏进度 (HideProgress)', value: formData.hideprogress ? '是' : undefined }
        ].filter(f => f.value !== undefined && f.value !== '' && f.value !== null)
      };
    }
    return { icon: '?', title: '未知 (Unknown)', color: '#999', fields: [] };
  };
  
  const content = getDisplayContent();
  
  return (
    <div 
      className={`checkpoint-module-node ${selected ? 'selected' : ''}`}
      style={{ borderColor: content.color }}
    >
      {/* 左侧输入句柄 - 标题下方 */}
      <Handle
        type="target"
        position={Position.Left}
        id="checkpoint"
        isConnectable={isConnectable}
        className="node-handle node-handle-input"
        style={{ top: '50px', background: '#FF9800' }}
        >
          <span className="handle-label handle-label-left">检查点 (checkpoint)</span>
        </Handle>
      
      {/* 右侧输出句柄 - 标题下方 */}
      {isConditionModule && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="oncomplete"
            isConnectable={isConnectable}
            className="node-handle node-handle-output"
            style={{ top: '50px', background: '#4CAF50' }}
          >
            <span className="handle-label handle-label-right">完成时 (oncomplete)</span>
          </Handle>
          <Handle
            type="source"
            position={Position.Right}
            id="onviolatecondition"
            isConnectable={isConnectable}
            className="node-handle node-handle-output"
            style={{ top: '75px', background: '#FF5722' }}
          >
            <span className="handle-label handle-label-right">违反时 (onviolatecondition)</span>
          </Handle>
        </>
      )}
      {isTravelConditionModule && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="oncomplete"
            isConnectable={isConnectable}
            className="node-handle node-handle-output"
            style={{ top: '50px', background: '#4CAF50' }}
          >
            <span className="handle-label handle-label-right">完成时 (oncomplete)</span>
          </Handle>
          <Handle
            type="source"
            position={Position.Right}
            id="onviolatecondition"
            isConnectable={isConnectable}
            className="node-handle node-handle-output"
            style={{ top: '75px', background: '#FF5722' }}
          >
            <span className="handle-label handle-label-right">违反时 (onviolatecondition)</span>
          </Handle>
        </>
      )}      {/* 模块头部 */}
      <div className="module-header" style={{ backgroundColor: content.color }}>
        <span className="module-icon">{content.icon}</span>
        <span className="module-title">{content.title}</span>
      </div>
      
      {/* 模块内容 */}
      <div className="module-content">
        {content.fields.length === 0 ? (
          <div className="empty-hint">暂无配置</div>
        ) : (
          content.fields.map((field, index) => (
            <div key={index} className={`field ${field.multiline ? 'multiline' : ''} ${field.highlight ? 'highlight' : ''}`}>
              <span className="field-label">{field.label}:</span>
              {field.multiline && field.label.includes('描述') ? (
                /* Description 字段可双击编辑 */
                isEditingDescription ? (
                  <textarea
                    ref={textareaRef}
                    className="field-edit-textarea"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={4}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span 
                    className="field-value editable"
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setIsEditingDescription(true);
                    }}
                    title="双击编辑 (Double-click to edit) | Ctrl+Enter保存, Esc取消"
                  >
                    {field.value || '双击编辑描述... (Double-click to edit)'}
                  </span>
                )
              ) : (
                /* 其他字段只显示 */
                <span className="field-value">
                  {field.multiline && field.value.length > 60
                    ? `${field.value.substring(0, 60)}...`
                    : field.value}
                </span>
              )}
            </div>
          ))
        )}
        {!isEditingDescription && <div className="edit-hint">双击描述编辑 (Double-click description) | 点击节点在右侧编辑其他字段 (Click node to edit other fields)</div>}
      </div>
    </div>
  );
};

export default memo(CheckpointModuleNode);
