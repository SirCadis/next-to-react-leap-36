import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Student, Teacher, Payment, SchoolClass, SchoolYear } from '../types/electron';

// Check if we're running in Electron
const isElectronAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.electronAPI;
};

// Get API with proper fallback
const getAPI = () => {
  if (!isElectronAvailable()) {
    throw new Error('Electron API not available');
  }
  return window.electronAPI;
};

// School Years hooks
export const useSchoolYears = () => {
  return useQuery<SchoolYear[]>({
    queryKey: ['schoolYears'],
    queryFn: () => getAPI().getSchoolYears(),
    enabled: isElectronAvailable(),
  });
};

export const useActiveSchoolYear = () => {
  return useQuery<SchoolYear | undefined>({
    queryKey: ['activeSchoolYear'],
    queryFn: () => getAPI().getActiveSchoolYear(),
    enabled: isElectronAvailable(),
  });
};

export const useCreateSchoolYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (year: Omit<SchoolYear, 'id'>) => getAPI().createSchoolYear(year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schoolYears'] });
      queryClient.invalidateQueries({ queryKey: ['activeSchoolYear'] });
    },
  });
};

// Students hooks
export const useStudents = (yearId?: number) => {
  return useQuery<Student[]>({
    queryKey: ['students', yearId],
    queryFn: () => getAPI().getStudents(yearId),
    enabled: isElectronAvailable(),
  });
};

export const useStudent = (id: number) => {
  return useQuery<Student | undefined>({
    queryKey: ['student', id],
    queryFn: () => getAPI().getStudent(id),
    enabled: isElectronAvailable() && !!id,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (student: Omit<Student, 'id'>) => getAPI().createStudent(student),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, student }: { id: number; student: Partial<Student> }) =>
      getAPI().updateStudent(id, student),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student'] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => getAPI().deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
};

// Teachers hooks
export const useTeachers = (yearId?: number) => {
  return useQuery<Teacher[]>({
    queryKey: ['teachers', yearId],
    queryFn: () => getAPI().getTeachers(yearId),
    enabled: isElectronAvailable(),
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (teacher: Omit<Teacher, 'id'>) => getAPI().createTeacher(teacher),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
    },
  });
};

// Payments hooks
export const usePayments = (studentId?: number, yearId?: number) => {
  return useQuery<Payment[]>({
    queryKey: ['payments', studentId, yearId],
    queryFn: () => getAPI().getPayments(studentId, yearId),
    enabled: isElectronAvailable(),
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payment: Omit<Payment, 'id'>) => getAPI().createPayment(payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payment }: { id: number; payment: Partial<Payment> }) =>
      getAPI().updatePayment(id, payment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

// Classes hooks
export const useClasses = (yearId?: number) => {
  return useQuery<SchoolClass[]>({
    queryKey: ['classes', yearId],
    queryFn: () => getAPI().getClasses(yearId),
    enabled: isElectronAvailable(),
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schoolClass: Omit<SchoolClass, 'id'>) => getAPI().createClass(schoolClass),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });
};