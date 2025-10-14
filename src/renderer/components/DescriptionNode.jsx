import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import './DescriptionNode.css';

export const DescriptionNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(data.formData?.text || data.formData?.description || data.formData?.faildescription || '');
  const textareaRef = useRef(null);

  // 检测是否为失败描述节点（UI-only）
  const isFailed = data.formData?.type === 'failed' || data.uiOnly === true;

  // 同步外部数据变化
  useEffect(() => {
    const newText = data.formData?.text || data.formData?.description || data.formData?.faildescription || '';
    setEditedText(newText);
  }, [data.formData?.text, data.formData?.description, data.formData?.faildescription]);

  // 双击开始编辑（失败描述节点不可编辑）
  const handleDoubleClick = () => {
    if (!isFailed) {
      setIsEditing(true);
    }
  };

  // 失焦时保存
  const handleBlur = () => {
    setIsEditing(false);
    if (data.onUpdate) {
      data.onUpdate({ text: editedText });
    }
  };

  // 按键处理
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setEditedText(data.formData?.text || data.formData?.description || '');
      setIsEditing(false);
    }
    // Ctrl+Enter 保存并退出
    if (e.key === 'Enter' && e.ctrlKey) {
      handleBlur();
    }
  };

  // 编辑模式下自动聚焦
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const displayText = data.formData?.text || data.formData?.description || data.formData?.faildescription || '双击编辑描述...';
  const isPlaceholder = !data.formData?.text && !data.formData?.description && !data.formData?.faildescription;

  return (
    <div 
      className={`description-node ${selected ? 'selected' : ''} ${isPlaceholder ? 'placeholder' : ''} ${isFailed ? 'failed-type' : ''}`}
      onDoubleClick={!isEditing && !isFailed ? handleDoubleClick : undefined}
    >
      {/* 输出句柄（仅普通描述节点有，失败描述节点没有） */}
      {!isFailed && (
        <Handle
          type="source"
          position={Position.Right}
          id="out"
          className="description-handle"
          style={{ top: '50%', background: '#757575' }}
        />
      )}
      
      {/* 输入句柄 - 用于接收连接（所有描述节点都有） */}
      <Handle
        type="target"
        position={Position.Left}
        id="checkpoint"
        className="description-handle"
        style={{ top: '50%', background: isFailed ? '#FF5722' : '#757575' }}
      />

      <div className="description-header">
        <span className="description-icon">{isFailed ? '❌' : '📝'}</span>
        <span className="description-title">{isFailed ? '失败描述 (UI-Only)' : '描述'}</span>
      </div>

      <div className="description-content">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            className="description-textarea"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            rows={6}
            placeholder="输入描述文本... (Ctrl+Enter保存, Esc取消)"
          />
        ) : (
          <div className="description-text">
            {displayText}
            {isFailed && (
              <div className="failed-badge">仅UI显示，不导出到JSON</div>
            )}
          </div>
        )}
      </div>

      {!isEditing && !isFailed && (
        <div className="description-hint">双击编辑 | Ctrl+Enter保存</div>
      )}
      {isFailed && (
        <div className="description-hint">从模块的 faildescription 字段自动生成</div>
      )}
    </div>
  );
};

export default DescriptionNode;
