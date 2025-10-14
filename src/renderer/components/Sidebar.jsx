import React, { useState } from 'react';
import { NodesByCategory, NodeCategories } from '../config/nodeTypes';
import './Sidebar.css';

const Sidebar = ({ 
  onAddNode, 
  onAddCustomNode,
  exportPath,
  onExportPathChange,
  onSelectFolder,
  onOpenFolder,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState('nodes');
  const [autoCollapse, setAutoCollapse] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({
    [NodeCategories.BASIC]: true,
    [NodeCategories.ZONE]: true,
    [NodeCategories.CHECKPOINT]: true,
    [NodeCategories.DIALOGUE]: false,
    [NodeCategories.CONDITION]: false,
    [NodeCategories.ACTION]: true,
    [NodeCategories.TELEPORT]: false,
    [NodeCategories.SPECIAL]: false
  });

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleAddNode = (nodeTemplate) => {
    onAddNode(nodeTemplate);
    // 自动收起功能
    if (autoCollapse) {
      console.log('自动收起已启用，关闭面板');
      setActiveTab(null);
    }
  };

  // 处理节点拖拽开始
  const handleDragStart = (e, nodeTemplate) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/reactflow-node', JSON.stringify(nodeTemplate));
    console.log('开始拖拽节点:', nodeTemplate.label);
  };

  const handleTabClick = (tab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  // 鼠标进入工具栏按钮时自动展开
  const handleButtonMouseEnter = (tab) => {
    if (autoCollapse) {
      setActiveTab(tab);
    }
  };

  // 鼠标离开侧边栏时自动收起
  const handleMouseLeave = () => {
    if (autoCollapse && activeTab) {
      console.log('鼠标离开侧边栏，自动收起面板');
      setActiveTab(null);
    }
  };

  return (
    <div className="sidebar-container" onMouseLeave={handleMouseLeave}>
      <div className="sidebar-toolbar">
        <div 
          className={`toolbar-button ${autoCollapse ? 'active' : ''}`}
          onClick={() => setAutoCollapse(!autoCollapse)}
          title={`自动收起: ${autoCollapse ? '开启（已锁定）' : '关闭（已解锁）'}`}
        >
          <span className="toolbar-icon">{autoCollapse ? '�' : '🔓'}</span>
          <span className="toolbar-label">{autoCollapse ? '已锁' : '未锁'}</span>
        </div>
        
        <div className="toolbar-divider"></div>
        
        <div 
          className={`toolbar-button ${activeTab === 'nodes' ? 'active' : ''}`}
          onClick={() => handleTabClick('nodes')}
          onMouseEnter={() => handleButtonMouseEnter('nodes')}
          title="节点库"
        >
          <span className="toolbar-icon">�</span>
          <span className="toolbar-label">节点</span>
        </div>
        
        <div 
          className={`toolbar-button ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => handleTabClick('export')}
          onMouseEnter={() => handleButtonMouseEnter('export')}
          title="导出设置"
        >
          <span className="toolbar-icon">�</span>
          <span className="toolbar-label">导出</span>
        </div>

        <div 
          className={`toolbar-button ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => handleTabClick('files')}
          onMouseEnter={() => handleButtonMouseEnter('files')}
          title="文件资源管理器"
        >
          <span className="toolbar-icon">�</span>
          <span className="toolbar-label">文件</span>
        </div>

        <div className="toolbar-spacer"></div>
      </div>

      {activeTab && (
        <div className="sidebar-content">
          {activeTab === 'nodes' && (
            <div className="panel nodes-panel">
              <div className="panel-header">
                <h2>📚 节点库</h2>
                <button 
                  className="btn-close-panel" 
                  onClick={() => setActiveTab(null)}
                  title="关闭面板"
                >
                  ✕
                </button>
              </div>

              <div className="category-list">
                {Object.entries(NodesByCategory).map(([category, nodes]) => (
                  <div key={category} className="category-group">
                    <div 
                      className="category-header" 
                      onClick={() => toggleCategory(category)}
                    >
                      <span className={`category-arrow ${expandedCategories[category] ? 'expanded' : ''}`}>
                        ▶
                      </span>
                      <span className="category-name">{category}</span>
                      <span className="category-count">{nodes.length}</span>
                    </div>

                    {expandedCategories[category] && (
                      <div className="category-nodes">
                        {nodes.map((nodeTemplate, index) => (
                          <div
                            key={index}
                            className="node-template-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, nodeTemplate)}
                            onClick={() => handleAddNode(nodeTemplate)}
                            title={nodeTemplate.description}
                          >
                            <div className="template-icon-emoji">{nodeTemplate.icon}</div>
                            <div className="template-info">
                              <div className="template-label">{nodeTemplate.label}</div>
                              <div className="template-description">{nodeTemplate.description}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="panel-footer">
                <h3>⌨️ 快捷键</h3>
                <ul>
                  <li><kbd>Space</kbd> + 拖拽 - 移动画布</li>
                  <li><kbd>Scroll</kbd> - 缩放画布</li>
                  <li><kbd>Del</kbd> - 删除选中项</li>
                  <li><kbd>Ctrl</kbd> + <kbd>S</kbd> - 保存工作流</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="panel export-panel">
              <div className="panel-header">
                <h2>📦 导出设置</h2>
                <button 
                  className="btn-close-panel" 
                  onClick={() => setActiveTab(null)}
                  title="关闭面板"
                >
                  ✕
                </button>
              </div>

              <div className="export-content">
                <div className="export-section">
                  <h3>📁 导出路径</h3>
                  <p className="section-description">选择任务文件的导出位置</p>
                  
                  <div className="export-path-input">
                    <input 
                      type="text" 
                      value={exportPath || ''} 
                      onChange={(e) => onExportPathChange(e.target.value)}
                      placeholder="选择导出文件夹..."
                      title={exportPath || '请选择导出文件夹'}
                    />
                    <button 
                      className="btn-select-folder" 
                      onClick={onSelectFolder}
                      title="浏览文件夹"
                    >
                      📁
                    </button>
                  </div>

                  {exportPath && (
                    <div className="path-info">
                      <span className="path-label">当前路径:</span>
                      <span className="path-value" title={exportPath}>{exportPath}</span>
                    </div>
                  )}
                </div>

                <div className="export-section">
                  <h3>⚙️ 操作</h3>
                  <div className="export-actions">
                    <button 
                      className="action-button btn-open-folder" 
                      onClick={onOpenFolder}
                      disabled={!exportPath}
                      title={exportPath ? '在文件管理器中打开' : '请先选择文件夹'}
                    >
                      <span className="btn-icon">📂</span>
                      <span className="btn-text">打开文件夹</span>
                    </button>
                    
                    <button 
                      className="action-button btn-export-main" 
                      onClick={onExport}
                      title="导出任务到选定文件夹"
                    >
                      <span className="btn-icon">💾</span>
                      <span className="btn-text">导出任务</span>
                    </button>
                  </div>
                </div>

                <div className="export-section">
                  <h3>ℹ️ 说明</h3>
                  <ul className="info-list">
                    <li>导出格式为 JSON 文件</li>
                    <li>文件名包含任务标题和时间戳</li>
                    <li>如未选择路径，将下载到默认位置</li>
                    <li>导出后会在状态栏显示提示</li>
                  </ul>
                </div>

                <div className="export-section">
                  <h3>🎨 自动收起</h3>
                  <div className="auto-collapse-setting">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={autoCollapse}
                        onChange={(e) => setAutoCollapse(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="setting-label">
                      {autoCollapse ? '已启用 - 操作后自动关闭面板' : '已禁用 - 面板保持打开'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 文件资源管理器面板 */}
          {activeTab === 'files' && (
            <div className="panel files-panel">
              <div className="panel-header">
                <h2>📁 文件资源管理器</h2>
                <button 
                  className="btn-close-panel" 
                  onClick={() => setActiveTab(null)}
                  title="关闭面板"
                >
                  ✕
                </button>
              </div>

              <div className="files-content">
                <div className="files-section">
                  <h3>📂 快速导入</h3>
                  <p className="section-description">选择JSON文件快速导入任务</p>
                  
                  <div className="file-upload-area">
                    <input 
                      type="file" 
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // 记录文件路径
                          const filePath = file.path || file.webkitRelativePath || file.name;
                          
                          // 读取文件内容
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const json = JSON.parse(event.target.result);
                              console.log('文件内容:', json);
                              
                              // 保存到最近文件列表
                              const recentFiles = JSON.parse(localStorage.getItem('recentFiles') || '[]');
                              const fileInfo = {
                                name: file.name,
                                path: filePath,
                                title: json.title || '未命名任务',
                                timestamp: Date.now()
                              };
                              
                              // 去重并添加到开头
                              const filtered = recentFiles.filter(f => f.path !== filePath);
                              filtered.unshift(fileInfo);
                              
                              // 只保留最近10个文件
                              const limited = filtered.slice(0, 10);
                              localStorage.setItem('recentFiles', JSON.stringify(limited));
                              
                              // 触发导入
                              if (window.handleFileImport) {
                                window.handleFileImport(json);
                              }
                            } catch (error) {
                              console.error('文件解析失败:', error);
                              alert('文件解析失败: ' + error.message);
                            }
                          };
                          reader.readAsText(file);
                        }
                        e.target.value = '';
                      }}
                      style={{ display: 'none' }}
                      id="file-import-input"
                    />
                    <label htmlFor="file-import-input" className="file-upload-label">
                      <span className="upload-icon">📄</span>
                      <span className="upload-text">点击选择JSON文件</span>
                      <span className="upload-hint">或拖拽文件到此处</span>
                    </label>
                  </div>
                </div>

                <div className="files-section">
                  <h3>📋 最近打开的文件</h3>
                  <div className="recent-files-list">
                    {(() => {
                      const recentFiles = JSON.parse(localStorage.getItem('recentFiles') || '[]');
                      if (recentFiles.length === 0) {
                        return (
                          <div className="empty-state">
                            <span className="empty-icon">📭</span>
                            <p>暂无最近打开的文件</p>
                          </div>
                        );
                      }
                      return recentFiles.map((file, index) => (
                        <div key={index} className="recent-file-item" title={file.path}>
                          <div className="file-icon">📄</div>
                          <div className="file-info">
                            <div className="file-name">{file.name}</div>
                            <div className="file-title">{file.title}</div>
                            <div className="file-path">{file.path}</div>
                            <div className="file-time">
                              {new Date(file.timestamp).toLocaleString('zh-CN')}
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                <div className="files-section">
                  <h3>ℹ️ 支持格式</h3>
                  <ul className="info-list">
                    <li>塞雷卡任务JSON文件 (.json)</li>
                    <li>工作流导出文件 (.json)</li>
                    <li>支持拖拽导入</li>
                    <li>自动识别文件格式</li>
                    <li>记录最近10个打开的文件</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
