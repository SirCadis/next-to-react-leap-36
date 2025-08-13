import { contextBridge, ipcRenderer } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {
  // School Years
  getSchoolYears: () => ipcRenderer.invoke('db:getSchoolYears'),
  getActiveSchoolYear: () => ipcRenderer.invoke('db:getActiveSchoolYear'),
  createSchoolYear: (year: any) => ipcRenderer.invoke('db:createSchoolYear', year),

  // Students
  getStudents: (yearId?: number) => ipcRenderer.invoke('db:getStudents', yearId),
  getStudent: (id: number) => ipcRenderer.invoke('db:getStudent', id),
  createStudent: (student: any) => ipcRenderer.invoke('db:createStudent', student),
  updateStudent: (id: number, student: any) => ipcRenderer.invoke('db:updateStudent', id, student),
  deleteStudent: (id: number) => ipcRenderer.invoke('db:deleteStudent', id),

  // Teachers
  getTeachers: (yearId?: number) => ipcRenderer.invoke('db:getTeachers', yearId),
  createTeacher: (teacher: any) => ipcRenderer.invoke('db:createTeacher', teacher),

  // Payments
  getPayments: (studentId?: number, yearId?: number) => ipcRenderer.invoke('db:getPayments', studentId, yearId),
  createPayment: (payment: any) => ipcRenderer.invoke('db:createPayment', payment),
  updatePayment: (id: number, payment: any) => ipcRenderer.invoke('db:updatePayment', id, payment),

  // Classes
  getClasses: (yearId?: number) => ipcRenderer.invoke('db:getClasses', yearId),
  createClass: (schoolClass: any) => ipcRenderer.invoke('db:createClass', schoolClass),
});