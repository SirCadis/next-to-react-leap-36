import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

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

class SchoolDatabase {
  private db: Database.Database;

  constructor() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'school.db');
    
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initializeTables();
  }

  private initializeTables() {
    // Create tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS school_years (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        startDate TEXT NOT NULL,
        endDate TEXT NOT NULL,
        isActive BOOLEAN DEFAULT FALSE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        level TEXT NOT NULL,
        maxStudents INTEGER DEFAULT 30,
        teacherId INTEGER,
        yearId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (yearId) REFERENCES school_years (id) ON DELETE CASCADE,
        FOREIGN KEY (teacherId) REFERENCES teachers (id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        dateOfBirth TEXT,
        address TEXT,
        enrollmentDate TEXT NOT NULL,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
        classId INTEGER,
        yearId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (classId) REFERENCES classes (id) ON DELETE SET NULL,
        FOREIGN KEY (yearId) REFERENCES school_years (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        subject TEXT,
        hireDate TEXT NOT NULL,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        yearId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (yearId) REFERENCES school_years (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER NOT NULL,
        amount REAL NOT NULL,
        paymentDate TEXT NOT NULL,
        paymentType TEXT DEFAULT 'tuition' CHECK (paymentType IN ('tuition', 'fees', 'services', 'other')),
        description TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
        yearId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students (id) ON DELETE CASCADE,
        FOREIGN KEY (yearId) REFERENCES school_years (id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_students_year ON students(yearId);
      CREATE INDEX IF NOT EXISTS idx_teachers_year ON teachers(yearId);
      CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(studentId);
      CREATE INDEX IF NOT EXISTS idx_payments_year ON payments(yearId);
      CREATE INDEX IF NOT EXISTS idx_classes_year ON classes(yearId);
    `);

    // Insert default school year if none exists
    const yearCount = this.db.prepare('SELECT COUNT(*) as count FROM school_years').get() as { count: number };
    if (yearCount.count === 0) {
      const currentYear = new Date().getFullYear();
      this.db.prepare(`
        INSERT INTO school_years (name, startDate, endDate, isActive)
        VALUES (?, ?, ?, ?)
      `).run(
        `${currentYear}-${currentYear + 1}`,
        `${currentYear}-09-01`,
        `${currentYear + 1}-06-30`,
        true
      );
    }
  }

  // School Years
  getSchoolYears(): SchoolYear[] {
    return this.db.prepare('SELECT * FROM school_years ORDER BY startDate DESC').all() as SchoolYear[];
  }

  getActiveSchoolYear(): SchoolYear | undefined {
    return this.db.prepare('SELECT * FROM school_years WHERE isActive = 1 LIMIT 1').get() as SchoolYear;
  }

  createSchoolYear(year: Omit<SchoolYear, 'id'>): SchoolYear {
    const stmt = this.db.prepare(`
      INSERT INTO school_years (name, startDate, endDate, isActive)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(year.name, year.startDate, year.endDate, year.isActive);
    return { id: result.lastInsertRowid as number, ...year };
  }

  // Students
  getStudents(yearId?: number): Student[] {
    if (yearId) {
      return this.db.prepare('SELECT * FROM students WHERE yearId = ? ORDER BY lastName, firstName').all(yearId) as Student[];
    }
    return this.db.prepare('SELECT * FROM students ORDER BY lastName, firstName').all() as Student[];
  }

  getStudent(id: number): Student | undefined {
    return this.db.prepare('SELECT * FROM students WHERE id = ?').get(id) as Student;
  }

  createStudent(student: Omit<Student, 'id'>): Student {
    const stmt = this.db.prepare(`
      INSERT INTO students (firstName, lastName, email, phone, dateOfBirth, address, enrollmentDate, status, classId, yearId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      student.firstName, student.lastName, student.email, student.phone,
      student.dateOfBirth, student.address, student.enrollmentDate,
      student.status, student.classId, student.yearId
    );
    return { id: result.lastInsertRowid as number, ...student };
  }

  updateStudent(id: number, student: Partial<Student>): void {
    const fields = Object.keys(student).filter(key => key !== 'id');
    const values = fields.map(field => student[field as keyof Student]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    this.db.prepare(`UPDATE students SET ${setClause} WHERE id = ?`).run(...values, id);
  }

  deleteStudent(id: number): void {
    this.db.prepare('DELETE FROM students WHERE id = ?').run(id);
  }

  // Teachers
  getTeachers(yearId?: number): Teacher[] {
    if (yearId) {
      return this.db.prepare('SELECT * FROM teachers WHERE yearId = ? ORDER BY lastName, firstName').all(yearId) as Teacher[];
    }
    return this.db.prepare('SELECT * FROM teachers ORDER BY lastName, firstName').all() as Teacher[];
  }

  createTeacher(teacher: Omit<Teacher, 'id'>): Teacher {
    const stmt = this.db.prepare(`
      INSERT INTO teachers (firstName, lastName, email, phone, subject, hireDate, status, yearId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      teacher.firstName, teacher.lastName, teacher.email, teacher.phone,
      teacher.subject, teacher.hireDate, teacher.status, teacher.yearId
    );
    return { id: result.lastInsertRowid as number, ...teacher };
  }

  // Payments
  getPayments(studentId?: number, yearId?: number): Payment[] {
    if (studentId && yearId) {
      return this.db.prepare('SELECT * FROM payments WHERE studentId = ? AND yearId = ? ORDER BY paymentDate DESC').all(studentId, yearId) as Payment[];
    } else if (studentId) {
      return this.db.prepare('SELECT * FROM payments WHERE studentId = ? ORDER BY paymentDate DESC').all(studentId) as Payment[];
    } else if (yearId) {
      return this.db.prepare('SELECT * FROM payments WHERE yearId = ? ORDER BY paymentDate DESC').all(yearId) as Payment[];
    }
    return this.db.prepare('SELECT * FROM payments ORDER BY paymentDate DESC').all() as Payment[];
  }

  createPayment(payment: Omit<Payment, 'id'>): Payment {
    const stmt = this.db.prepare(`
      INSERT INTO payments (studentId, amount, paymentDate, paymentType, description, status, yearId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      payment.studentId, payment.amount, payment.paymentDate,
      payment.paymentType, payment.description, payment.status, payment.yearId
    );
    return { id: result.lastInsertRowid as number, ...payment };
  }

  updatePayment(id: number, payment: Partial<Payment>): void {
    const fields = Object.keys(payment).filter(key => key !== 'id');
    const values = fields.map(field => payment[field as keyof Payment]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    this.db.prepare(`UPDATE payments SET ${setClause} WHERE id = ?`).run(...values, id);
  }

  // Classes
  getClasses(yearId?: number): SchoolClass[] {
    if (yearId) {
      return this.db.prepare('SELECT * FROM classes WHERE yearId = ? ORDER BY name').all(yearId) as SchoolClass[];
    }
    return this.db.prepare('SELECT * FROM classes ORDER BY name').all() as SchoolClass[];
  }

  createClass(schoolClass: Omit<SchoolClass, 'id'>): SchoolClass {
    const stmt = this.db.prepare(`
      INSERT INTO classes (name, level, maxStudents, teacherId, yearId)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      schoolClass.name, schoolClass.level, schoolClass.maxStudents,
      schoolClass.teacherId, schoolClass.yearId
    );
    return { id: result.lastInsertRowid as number, ...schoolClass };
  }

  close(): void {
    this.db.close();
  }
}

export const schoolDatabase = new SchoolDatabase();