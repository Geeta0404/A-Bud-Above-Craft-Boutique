export type UserRole = "customer" | "admin";

export type User = {
  id: number;
  firebaseUid: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserProfileInput = {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
};

export type Address = {
  id: number;
  userId: number;
  label: string | null;
  fullName: string;
  phone: string | null;
  line1: string;
  line2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressInput = {
  label?: string | null;
  fullName: string;
  phone?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  province: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
};
