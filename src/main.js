const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    backgroundColor: '#1e1e1e',
    title: '塞雷卡工作流编辑器'
  });

  // 开发环境加载Vite服务器
  const isDev = !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000').catch(err => {
      console.error('Failed to load URL:', err);
    });
    mainWindow.webContents.openDevTools();
    
    // 添加错误监听
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Page failed to load:', errorCode, errorDescription);
    });
  } else {
    // 生产环境加载构建后的文件
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
