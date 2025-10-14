// 工作区管理工具类
export class WorkspaceManager {
  static STORAGE_KEY = 'sereka-workspace';
  static TABS_KEY = 'sereka-tabs';
  static ACTIVE_TAB_KEY = 'sereka-active-tab';

  // 保存工作区状态
  static saveWorkspace(tabs, activeTabId) {
    try {
      const workspace = {
        tabs: tabs.map(tab => ({
          id: tab.id,
          name: tab.name || tab.title || '工作流',
          nodes: tab.nodes,
          edges: tab.edges,
          viewport: tab.viewport,
          selectedNode: tab.selectedNode,
          lastModified: Date.now()
        })),
        activeTabId,
        timestamp: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(workspace));
      return true;
    } catch (error) {
      console.error('保存工作区失败:', error);
      return false;
    }
  }

  // 加载工作区状态
  static loadWorkspace() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;
      
      const workspace = JSON.parse(data);
      return workspace;
    } catch (error) {
      console.error('加载工作区失败:', error);
      return null;
    }
  }

  // 清除工作区
  static clearWorkspace() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.TABS_KEY);
      localStorage.removeItem(this.ACTIVE_TAB_KEY);
      return true;
    } catch (error) {
      console.error('清除工作区失败:', error);
      return false;
    }
  }

  // 保存单个标签页
  static saveTab(tab) {
    try {
      const workspace = this.loadWorkspace() || { tabs: [], activeTabId: null };
      const tabIndex = workspace.tabs.findIndex(t => t.id === tab.id);
      
      const tabData = {
        id: tab.id,
        name: tab.name || tab.title || '工作流',
        nodes: tab.nodes,
        edges: tab.edges,
        viewport: tab.viewport,
        selectedNode: tab.selectedNode,
        lastModified: Date.now()
      };

      if (tabIndex >= 0) {
        workspace.tabs[tabIndex] = tabData;
      } else {
        workspace.tabs.push(tabData);
      }

      workspace.timestamp = Date.now();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(workspace));
      return true;
    } catch (error) {
      console.error('保存标签页失败:', error);
      return false;
    }
  }

  // 删除标签页
  static deleteTab(tabId) {
    try {
      const workspace = this.loadWorkspace();
      if (!workspace) return false;

      workspace.tabs = workspace.tabs.filter(t => t.id !== tabId);
      workspace.timestamp = Date.now();
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(workspace));
      return true;
    } catch (error) {
      console.error('删除标签页失败:', error);
      return false;
    }
  }

  // 获取存储大小
  static getStorageSize() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return 0;
      return new Blob([data]).size;
    } catch (error) {
      return 0;
    }
  }

  // 格式化存储大小
  static formatStorageSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
}
