export enum UserRole {
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
  DISPATCHER = 'DISPATCHER'
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phoneNumber: string;
  profilePicture?: string;
  isOnDuty?: boolean;
  assignedCart?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phoneNumber: string;
  profilePicture?: string;
  isOnDuty?: boolean;
  assignedCart?: string;
  token: string;
  createdAt: string;
  updatedAt: string;
} 