// Electron main process - Application shell handling window management, IPC communication, and file system operations

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Import logger
const logger = require('./src/logger');

let mainWindow;

// Application state
const appState = {
  projectName: '',
  frequencyRange: [1, 20000], // MHz (1 MHz to 20 GHz)
  units: 'GHz', // Default units
  points: [], // Array of points {id, x, y, z}
  objects: [], // Array of objects
  currentProjectPath: null,
  historyStack: [], // For undo
  redoStack: [] // For redo
};

// Create browser window
function createWindow() {
  logger.info('Creating browser window');
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      sandbox: false // Disable sandbox for Linux compatibility
    },
    icon: path.join(__dirname, 'icon.png'),
    frame: true
  });
  
  // Load the application
  mainWindow.loadFile('index.html');
  
  // Open DevTools in development
  // mainWindow.webContents.openDevTools();
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle new project creation
ipcMain.on('new-project', (event) => {
  logger.info('New project requested');
  
  // Reset application state
  appState.projectName = '';
  appState.frequencyRange = [1, 20000];
  appState.units = 'GHz';
  appState.points = [];
  appState.objects = [];
  appState.currentProjectPath = null;
  appState.historyStack = [];
  appState.redoStack = [];
  
  // Send event to renderer
  mainWindow.webContents.send('new-project-loaded', {
    projectName: appState.projectName,
    frequencyRange: appState.frequencyRange,
    units: appState.units,
    points: appState.points,
    objects: appState.objects
  });
});

// Handle project save
ipcMain.handle('save-project', async (event, projectData) => {
  logger.info('Project save requested');
  
  try {
    // Show save dialog
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Project',
      defaultPath: 'antenna-project.json',
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ]
    });
    
    if (!result.canceled && result.filePath) {
      // Write project data to file
      const filePath = result.filePath;
      const data = JSON.stringify(projectData, null, 2);
      fs.writeFileSync(filePath, data);
      
      appState.currentProjectPath = filePath;
      appState.projectName = path.basename(filePath, '.json');
      
      logger.info(`Project saved to ${filePath}`);
      return { success: true, filePath };
    }
    
    return { success: false, error: 'Save canceled' };
  } catch (error) {
    logger.error('Save error:', error);
    return { success: false, error: error.message };
  }
});

// Handle project load
ipcMain.handle('load-project', async (event, filePath) => {
  logger.info(`Project load requested: ${filePath}`);
  
  try {
    // Show open dialog
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Open Project',
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      const projectPath = result.filePaths[0];
      
      // Read project data from file
      const data = fs.readFileSync(projectPath, 'utf8');
      const projectData = JSON.parse(data);
      
      // Update application state
      appState.currentProjectPath = projectPath;
      appState.projectName = path.basename(projectPath, '.json');
      appState.frequencyRange = projectData.frequencyRange || [1, 20000];
      appState.units = projectData.units || 'GHz';
      appState.points = projectData.points || [];
      appState.objects = projectData.objects || [];
      
      logger.info(`Project loaded from ${projectPath}`);
      
      // Send event to renderer
      mainWindow.webContents.send('project-loaded', {
        projectName: appState.projectName,
        frequencyRange: appState.frequencyRange,
        units: appState.units,
        points: appState.points,
        objects: appState.objects
      });
      
      return { success: true, data: projectData };
    }
    
    return { success: false, error: 'Load canceled' };
  } catch (error) {
    logger.error('Load error:', error);
    return { success: false, error: error.message };
  }
});

// Handle push to history (for undo/redo)
ipcMain.on('push-to-history', (event, state) => {
  logger.debug('Pushing state to history');
  
  // Add current state to history
  appState.historyStack.push(JSON.parse(JSON.stringify(appState)));
  
  // Clear redo stack on new action
  appState.redoStack = [];
  
  // Limit history size (e.g., 50 actions)
  if (appState.historyStack.length > 50) {
    appState.historyStack.shift();
  }
});

// Handle undo
ipcMain.on('undo', (event) => {
  logger.debug('Undo requested');
  
  if (appState.historyStack.length > 0) {
    // Pop from history and push to redo
    const previousState = appState.historyStack.pop();
    appState.redoStack.push(JSON.parse(JSON.stringify(appState)));
    
    // Restore previous state
    restoreState(previousState);
  }
});

// Handle redo
ipcMain.on('redo', (event) => {
  logger.debug('Redo requested');
  
  if (appState.redoStack.length > 0) {
    // Pop from redo and push to history
    const nextState = appState.redoStack.pop();
    appState.historyStack.push(JSON.parse(JSON.stringify(appState)));
    
    // Restore next state
    restoreState(nextState);
  }
});

// Restore application state
function restoreState(state) {
  appState.projectName = state.projectName;
  appState.frequencyRange = state.frequencyRange;
  appState.units = state.units;
  appState.points = state.points;
  appState.objects = state.objects;
  appState.currentProjectPath = state.currentProjectPath;
  
  // Send updated state to renderer
  mainWindow.webContents.send('state-restored', {
    projectName: appState.projectName,
    frequencyRange: appState.frequencyRange,
    units: appState.units,
    points: appState.points,
    objects: appState.objects
  });
}

// Handle application quit
app.on('window-all-closed', () => {
  // On macOS, quit only when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Application ready
app.on('ready', createWindow);
