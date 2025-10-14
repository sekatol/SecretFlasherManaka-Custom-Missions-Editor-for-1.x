import React, { useState, useMemo } from 'react';
import './CommandLibrarySelector.css';
import { 
  FieldLibraryMapping, 
  groupByCategory, 
  filterItems, 
  detectConflicts 
} from '../config/actionLibrary';

/**
 * 指令库选择器组件
 * 提供可搜索、可分类、支持多选的指令选择界面
 */
function CommandLibrarySelector({ 
  libraryType,          // 指令库类型: 'parts_cosplay', 'parts_adulttoy', 'itemtype', 'stage', 'level', 等
  selectedValues = [],  // 当前已选值的数组
  onChange,             // 选择变化回调: (newValues) => void
  multiSelect = true,   // 是否支持多选
  isOpen,               // 是否显示
  onClose               // 关闭回调
}) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 获取对应的指令库配置
  const libraryConfig = FieldLibraryMapping[libraryType];
  
  if (!libraryConfig) {
    console.error(`Unknown library type: ${libraryType}`);
    return null;
  }
  
  const { library, searchable, conflictDetection } = libraryConfig;
  
  // 过滤和分组指令
  const filteredItems = useMemo(() => {
    return searchable && searchTerm 
      ? filterItems(library, searchTerm)
      : library;
  }, [library, searchTerm, searchable]);
  
  const groupedItems = useMemo(() => {
    return groupByCategory(filteredItems);
  }, [filteredItems]);
  
  // 检测冲突
  const conflicts = useMemo(() => {
    if (!conflictDetection) return [];
    return detectConflicts(selectedValues, library);
  }, [selectedValues, library, conflictDetection]);
  
  // 处理选择
  const handleItemClick = (itemId) => {
    if (!multiSelect) {
      onChange([itemId]);
      onClose();
      return;
    }
    
    const newValues = selectedValues.includes(itemId)
      ? selectedValues.filter(id => id !== itemId)
      : [...selectedValues, itemId];
    
    onChange(newValues);
  };
  
  // 检查是否有冲突
  const hasConflict = (itemId) => {
    return conflicts.some(c => c.item1 === itemId || c.item2 === itemId);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="command-library-overlay" onClick={onClose}>
      <div className="command-library-modal" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="command-library-header">
          <h3>📚 选择指令</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        {/* 搜索框 */}
        {searchable && (
          <div className="command-library-search">
            <input
              type="text"
              placeholder="搜索指令ID或名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        )}
        
        {/* 已选指令显示 */}
        {selectedValues.length > 0 && (
          <div className="command-library-selected">
            <div className="selected-header">
              <span>已选择 ({selectedValues.length})</span>
              <button 
                className="clear-all-btn"
                onClick={() => onChange([])}
              >
                清空
              </button>
            </div>
            <div className="selected-items">
              {selectedValues.map(value => {
                const item = library.find(i => i.id === value);
                const conflicted = hasConflict(value);
                return (
                  <div 
                    key={value} 
                    className={`selected-item ${conflicted ? 'conflicted' : ''}`}
                    onClick={() => handleItemClick(value)}
                    title={conflicted ? '存在冲突，点击移除' : '点击移除'}
                  >
                    {item?.name || value}
                    {conflicted && <span className="conflict-icon">⚠️</span>}
                    <span className="remove-icon">×</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* 冲突提示 */}
        {conflicts.length > 0 && (
          <div className="command-library-conflicts">
            <strong>⚠️ 检测到冲突:</strong>
            {conflicts.map((conflict, index) => (
              <div key={index} className="conflict-item">
                {conflict.reason}
              </div>
            ))}
          </div>
        )}
        
        {/* 指令列表 */}
        <div className="command-library-content">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="empty-message">未找到匹配的指令</div>
          ) : (
            Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="command-category">
                <div className="category-header">{category}</div>
                <div className="category-items">
                  {items.map(item => {
                    const isSelected = selectedValues.includes(item.id);
                    const isConflicted = hasConflict(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`command-item ${isSelected ? 'selected' : ''} ${isConflicted ? 'conflicted' : ''}`}
                        onClick={() => handleItemClick(item.id)}
                        title={item.description || item.id}
                      >
                        <div className="command-item-content">
                          <span className="command-name">{item.name}</span>
                          <span className="command-id">{item.id}</span>
                        </div>
                        {isSelected && <span className="check-icon">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* 底部操作 */}
        <div className="command-library-footer">
          <button className="btn-secondary" onClick={onClose}>
            取消
          </button>
          <button className="btn-primary" onClick={onClose}>
            确认选择 ({selectedValues.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommandLibrarySelector;
