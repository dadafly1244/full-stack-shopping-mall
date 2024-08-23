export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum UserPermissions {
  ADMIN = "ADMIN",
  USER = "USER",
}
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}
export type SortType = "asc" | "desc" | "none" | undefined;

export type UpdateUserInput = {
  id: string;
  user_id?: string;
  email?: string;
  name?: string;
  gender?: Gender;
  phone_number?: string;
  permissions?: UserPermissions;
};
export interface UserType {
  id: string;
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

export type ValueType = Gender | UserStatus | UserPermissions | string;

export interface SelectProps {
  key?: string;
  label: string;
  placeholder?: string;
  defaultValue: string;
  options: { value: ValueType; label: string }[];
  onChange?: (value: ValueType) => void;
  disabled?: boolean;
  isRight?: (value: ValueType) => boolean;
  className?: string; // 추가 스타일을 위한 클래스명
  variant?: "default" | "pass" | "nonePass";
}

export interface DetermineInputProps {
  label: string;
  key?: string;
  placeholder?: string;
  wrongMessage?: string;
  rightMessage?: string;
  isRight: (value: string) => boolean;
  inputLimit?: string;
  isRequired?: boolean;
  inputWidth?: number;
  className?: string;
  formatter?: (value: string) => string;
  onChange?: (value: string) => void;
  variant?: "default" | "pass" | "nonePass";
  button?: string | (() => Promise<string>);
  buttonClick?: (value: string) => Promise<boolean>;
}

export interface CustomDetermineInputProps extends Omit<DetermineInputProps, "isRight"> {
  isRight: (value: string) => boolean;
  key: keyof SignupType;
  type: "determineInput";
  formatter?: (a: string) => string;
}
export interface CustomUserDetermineInputProps extends Omit<DetermineInputProps, "isRight"> {
  isRight: (value: string) => boolean;
  key: keyof UserType;
  type: "determineInput";
  formatter?: (a: string) => string;
}

export interface CustomSelectProps extends SelectProps {
  key: keyof SignupType;
  type: "selectInput";
}

export interface CustomUserSelectProps extends SelectProps {
  key: keyof UserType;
  type: "selectInput";
}

export type UpdateFormItem = CustomUserDetermineInputProps | CustomUserSelectProps;

export type FormItem = CustomDetermineInputProps | CustomSelectProps;
export interface SignupType {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  user_id: string;
  gender: Gender;
  phone_number: string;
  status: UserStatus;
  permissions: UserPermissions;
}

export type sortingItem = {
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
};
