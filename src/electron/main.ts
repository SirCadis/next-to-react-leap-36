import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { schoolDatabase, Student, Teacher, Payment, SchoolClass, SchoolYear } from './database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../..');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    console.log('Loading from dev server:', VITE_DEV_SERVER_URL);
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(process.env.DIST, 'index.html');
    console.log('Loading from file:', indexPath);
    win.loadFile(indexPath);
  }

  // Handle load errors
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);

// Database IPC handlers
// School Years
ipcMain.handle('db:getSchoolYears', () => schoolDatabase.getSchoolYears());
ipcMain.handle('db:getActiveSchoolYear', () => schoolDatabase.getActiveSchoolYear());
ipcMain.handle('db:createSchoolYear', (_, year: Omit<SchoolYear, 'id'>) => schoolDatabase.createSchoolYear(year));

// Students
ipcMain.handle('db:getStudents', (_, yearId?: number) => schoolDatabase.getStudents(yearId));
ipcMain.handle('db:getStudent', (_, id: number) => schoolDatabase.getStudent(id));
ipcMain.handle('db:createStudent', (_, student: Omit<Student, 'id'>) => schoolDatabase.createStudent(student));
ipcMain.handle('db:updateStudent', (_, id: number, student: Partial<Student>) => schoolDatabase.updateStudent(id, student));
ipcMain.handle('db:deleteStudent', (_, id: number) => schoolDatabase.deleteStudent(id));

// Teachers
ipcMain.handle('db:getTeachers', (_, yearId?: number) => schoolDatabase.getTeachers(yearId));
ipcMain.handle('db:createTeacher', (_, teacher: Omit<Teacher, 'id'>) => schoolDatabase.createTeacher(teacher));

// Payments
ipcMain.handle('db:getPayments', (_, studentId?: number, yearId?: number) => schoolDatabase.getPayments(studentId, yearId));
ipcMain.handle('db:createPayment', (_, payment: Omit<Payment, 'id'>) => schoolDatabase.createPayment(payment));
ipcMain.handle('db:updatePayment', (_, id: number, payment: Partial<Payment>) => schoolDatabase.updatePayment(id, payment));

// Classes
ipcMain.handle('db:getClasses', (_, yearId?: number) => schoolDatabase.getClasses(yearId));
ipcMain.handle('db:createClass', (_, schoolClass: Omit<SchoolClass, 'id'>) => schoolDatabase.createClass(schoolClass));

// Handle app closing
app.on('before-quit', () => {
  schoolDatabase.close();
});