import React from 'react';
import './TabBar.css';

const TabBar = ({ tabs, activeTab, onTabClick, onTabClose, onNewTab, onClear }) => {
  return (
    <div className="tab-bar">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabClick(tab.id)}
          >
            <span className="tab-icon">📄</span>
            <span className="tab-label">{tab.name}</span>
            {tabs.length > 1 && (
              <button
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button className="tab-new" onClick={onNewTab} title="新建标签页">
          ➕
        </button>
        <button className="tab-clear" onClick={onClear} title="清空当前工作流">
          🗑️ 清空
        </button>
      </div>
    </div>
  );
};

export default TabBar;
