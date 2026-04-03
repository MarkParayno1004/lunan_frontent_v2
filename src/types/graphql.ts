export type DateScalar = string;
export type DateTimeScalar = string;

// GraphQL schema currently defines role/status as String, not enums.
export type UserRole = "PATIENT" | "COUNSELOR" | "ADMIN" | string;
export type AssignmentStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | string;

export interface UserModel {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  contactNo: string | null;
  role: string | null;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  contactNo: string;
  email: string;
  role: UserRole;
  createdAt: DateTimeScalar | null;
}

export interface Patient {
  id: string;
  user: User;
  emergencyContactPerson: string;
  emergencyContactNo: string;
  medicalHistory: string;
  currentMedication: string;
  gender: string;
  maritalStatus: string;
  dateOfBirth: DateScalar;
}

export interface Counselor {
  id: string;
  user: User;
  specialization: string;
  licenseNo: string;
}

export interface Diagnostic {
  id: string;
  counselor: Counselor;
  patient: Patient;
  description: string;
  createdAt: DateTimeScalar | null;
}

export interface Prescription {
  id: string;
  counselor: Counselor;
  patient: Patient;
  prescribedMedicine: string;
  createdAt: DateTimeScalar | null;
}

export interface Assignment {
  id: string;
  counselor: Counselor;
  patient: Patient;
  task: string;
  status: AssignmentStatus;
  createdAt: DateTimeScalar | null;
}
