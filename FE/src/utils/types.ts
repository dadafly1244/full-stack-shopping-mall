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
