export interface Student {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  classId?: number;
  yearId: number;
}

export interface Teacher {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject?: string;
  hireDate: string;
  status: 'active' | 'inactive';
  yearId: number;
}

export interface Payment {
  id?: number;
  studentId: number;
  amount: number;
  paymentDate: string;
  paymentType: 'tuition' | 'fees' | 'services' | 'other';
  description?: string;
  status: 'pending' | 'paid' | 'overdue';
  yearId: number;
}

export interface SchoolClass {
  id?: number;
  name: string;
  level: string;
  maxStudents?: number;
  teacherId?: number;
  yearId: number;
}

export interface SchoolYear {
  id?: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ElectronAPI {
  // School Years
  getSchoolYears: () => Promise<SchoolYear[]>;
  getActiveSchoolYear: () => Promise<SchoolYear | undefined>;
  createSchoolYear: (year: Omit<SchoolYear, 'id'>) => Promise<SchoolYear>;

  // Students
  getStudents: (yearId?: number) => Promise<Student[]>;
  getStudent: (id: number) => Promise<Student | undefined>;
  createStudent: (student: Omit<Student, 'id'>) => Promise<Student>;
  updateStudent: (id: number, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;

  // Teachers
  getTeachers: (yearId?: number) => Promise<Teacher[]>;
  createTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<Teacher>;

  // Payments
  getPayments: (studentId?: number, yearId?: number) => Promise<Payment[]>;
  createPayment: (payment: Omit<Payment, 'id'>) => Promise<Payment>;
  updatePayment: (id: number, payment: Partial<Payment>) => Promise<void>;

  // Classes
  getClasses: (yearId?: number) => Promise<SchoolClass[]>;
  createClass: (schoolClass: Omit<SchoolClass, 'id'>) => Promise<SchoolClass>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}