export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type UserPermissions = "ADMIN" | "USER";

export interface UserType {
  id?: string;
  name?: string;
  user_id?: string;
  email?: string;
  phone_number?: string;
  status?: UserStatus;
  permissions?: UserPermissions;
  gender?: Gender;
}

export interface SearchFilters {
  name: string;
  user_id: string;
  email: string;
  phone_number: string;
  status: UserStatus | null;
  permissions: UserPermissions | null;
  gender: Gender | null;
}

export interface CheckboxStates {
  name: boolean;
  user_id: boolean;
  email: boolean;
  phone_number: boolean;
  status: boolean;
  permissions: boolean;
  gender: boolean;
}
