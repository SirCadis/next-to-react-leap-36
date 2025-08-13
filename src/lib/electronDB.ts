// Utility functions for working with the Electron database
import type { Student, Teacher, Payment, SchoolClass, SchoolYear } from '../types/electron';

// Check if we're running in Electron
export const isElectronEnvironment = (): boolean => {
  return typeof window !== 'undefined' && !!window.electronAPI;
};

// Get the database API (with fallback for development)
export const getElectronAPI = () => {
  if (!isElectronEnvironment()) {
    // Return mock data for development in browser
    return createMockAPI();
  }
  return window.electronAPI;
};

// Mock API for browser development
const createMockAPI = () => {
  console.warn('Running in browser mode with mock data. Database operations will not persist.');
  
  // Mock data
  const mockStudents: Student[] = [
    {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '0123456789',
      dateOfBirth: '2005-06-15',
      address: '123 Rue de la Paix, Paris',
      enrollmentDate: '2023-09-01',
      status: 'active',
      yearId: 1,
      classId: 1
    },
    {
      id: 2,
      firstName: 'Marie',
      lastName: 'Martin',
      email: 'marie.martin@email.com',
      phone: '0123456790',
      dateOfBirth: '2005-03-22',
      address: '456 Avenue des Champs, Lyon',
      enrollmentDate: '2023-09-01',
      status: 'active',
      yearId: 1,
      classId: 1
    }
  ];

  const mockTeachers: Teacher[] = [
    {
      id: 1,
      firstName: 'Pierre',
      lastName: 'Durand',
      email: 'pierre.durand@school.com',
      phone: '0123456791',
      subject: 'Mathématiques',
      hireDate: '2020-09-01',
      status: 'active',
      yearId: 1
    }
  ];

  const mockPayments: Payment[] = [
    {
      id: 1,
      studentId: 1,
      amount: 500,
      paymentDate: '2024-01-15',
      paymentType: 'tuition',
      description: 'Frais de scolarité janvier',
      status: 'paid',
      yearId: 1
    }
  ];

  const mockClasses: SchoolClass[] = [
    {
      id: 1,
      name: 'Terminale S1',
      level: 'Terminale',
      maxStudents: 30,
      teacherId: 1,
      yearId: 1
    }
  ];

  const mockSchoolYears: SchoolYear[] = [
    {
      id: 1,
      name: '2023-2024',
      startDate: '2023-09-01',
      endDate: '2024-06-30',
      isActive: true
    }
  ];

  return {
    // School Years
    getSchoolYears: async () => mockSchoolYears,
    getActiveSchoolYear: async () => mockSchoolYears.find(y => y.isActive),
    createSchoolYear: async (year: Omit<SchoolYear, 'id'>) => ({ id: Date.now(), ...year }),

    // Students
    getStudents: async (yearId?: number) => 
      yearId ? mockStudents.filter(s => s.yearId === yearId) : mockStudents,
    getStudent: async (id: number) => mockStudents.find(s => s.id === id),
    createStudent: async (student: Omit<Student, 'id'>) => ({ id: Date.now(), ...student }),
    updateStudent: async (id: number, student: Partial<Student>) => {
      console.log('Mock update student:', id, student);
    },
    deleteStudent: async (id: number) => {
      console.log('Mock delete student:', id);
    },

    // Teachers
    getTeachers: async (yearId?: number) =>
      yearId ? mockTeachers.filter(t => t.yearId === yearId) : mockTeachers,
    createTeacher: async (teacher: Omit<Teacher, 'id'>) => ({ id: Date.now(), ...teacher }),

    // Payments
    getPayments: async (studentId?: number, yearId?: number) => {
      let filtered = mockPayments;
      if (studentId) filtered = filtered.filter(p => p.studentId === studentId);
      if (yearId) filtered = filtered.filter(p => p.yearId === yearId);
      return filtered;
    },
    createPayment: async (payment: Omit<Payment, 'id'>) => ({ id: Date.now(), ...payment }),
    updatePayment: async (id: number, payment: Partial<Payment>) => {
      console.log('Mock update payment:', id, payment);
    },

    // Classes
    getClasses: async (yearId?: number) =>
      yearId ? mockClasses.filter(c => c.yearId === yearId) : mockClasses,
    createClass: async (schoolClass: Omit<SchoolClass, 'id'>) => ({ id: Date.now(), ...schoolClass }),
  };
};