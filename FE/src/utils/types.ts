import { ReactNode } from "react";

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

export enum ProductStatus {
  AVAILABLE = "AVAILABLE",
  TEMPORARILY_OUT_OF_STOCK = "TEMPORARILY_OUT_OF_STOCK",
  OUT_OF_STOCK = "OUT_OF_STOCK",
  DISCONTINUED = "DISCONTINUED", //단종
  PROHIBITION_ON_SALE = "PROHIBITION_ON_SALE", // 판매금지
}

export enum OrderStatus {
  READY_TO_ORDER = "READY_TO_ORDER",
  ORDER = "ORDER",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUND = "REFUND",
  UNKNOWN = "UNKNOWN",
}

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

export interface CategoryType {
  id: number;
  name: string;
  subcategories?: CategoryType[];
}

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
  wrongMessage?: string | ((value: string) => string);
  rightMessage?: string | ((value: string) => string);
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

export interface CustomProductDetermineInputProps extends Omit<DetermineInputProps, "isRight"> {
  isRight: (value: string) => boolean;
  key: keyof ProductType;
  type: "determineInput";
  formatter?: (a: string) => string;
}
export interface CustomProductDetermineInput2Props extends Omit<DetermineInputProps, "isRight"> {
  isRight: (value: string) => boolean;
  key: keyof CreateProductStateType;
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

export interface CustomProductSelectProps extends SelectProps {
  key: keyof ProductType;
  type: "selectInput";
}

export interface DetermineTextareaProps {
  label: string;
  key?: string;
  placeholder?: string;
  wrongMessage?: string | ((value: string) => string);
  rightMessage?: string | ((value: string) => string);
  isRight: (value: string) => boolean;
  isRequired?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  variant?: "default" | "pass" | "nonePass";
  button?: string | (() => Promise<string>);
  buttonClick?: (value: string) => Promise<boolean>;

  // Textarea 특화 속성
  rows?: number;
  maxLength?: number;
  minLength?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
  autoResize?: boolean;
}

export interface CustomProductDetermineTextareaProps
  extends Omit<DetermineTextareaProps, "isRight"> {
  isRight: (value: string) => boolean;
  key: keyof ProductType;
  type: "determineTextarea";
}
export type UpdateProductFormItem =
  | CustomProductDetermineTextareaProps
  | CustomProductDetermineInputProps
  | CustomProductSelectProps;

export type UpdateUserFormItem = CustomUserDetermineInputProps | CustomUserSelectProps;

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
export type SortState<S> = {
  [K in keyof S]?: "asc" | "desc" | "none";
};

export interface TableColumn<T, S = T> {
  header: string;
  sort?: keyof S;
  key: keyof T;
  render?: (item: T) => ReactNode;
}
export interface TableProps<T, S = T> {
  title: string;
  data: T[];
  columns: TableColumn<T, S>[];
  onSortClick?: (key: keyof S) => void;
  onRowClick?: (item: T) => void;
  onSelectionChange?: (selectedItems: T[]) => void;
  sortState: SortState<S>;
}

export type sortingItem = {
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
};

export type ProductSortingItem = {
  name: string;
  price: number;
  sale: number;
  count: number;
  status: ProductStatus;
};

export interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
export interface ProductType {
  id: string;
  name: string;
  desc?: string;
  price: number;
  sale?: number;
  count: number;
  is_deleted: boolean;
  status: ProductStatus;
  main_image_path: string;
  desc_images_path?: string;
  category: {
    id: number;
    name: string;
  };
  store_id: string;
}

export interface ProductsInfoType {
  products: ProductType[];
  pageInfo: PageInfo;
}

export interface ProductSearchFilters {
  name: string;
  desc: string;
  price?: number;
  sale?: number;
  count?: number;
  is_deleted: boolean | null;
  status: ProductStatus | null;
  category_id: number;
  store_id: string;
}

export interface ProductCheckboxStates {
  name: boolean;
  desc: boolean;
  price?: boolean;
  sale?: boolean;
  count?: boolean;
  is_deleted: boolean;
  status: boolean;
  category_id: boolean;
  store_id: boolean;
}

export interface CreateProductStateType {
  name: string;
  desc?: string;
  price: number;
  sale?: number;
  count?: number;
  is_deleted: boolean;
  status: ProductStatus;
  main_image_path: File | null;
  desc_images_path?: File[];
  category: {
    id: number;
    name: string;
  };
  store_id: string;
}

export interface OrderProductType {
  id: string;
  name: string;
  sale?: number;
  price: number;
  desc: string;
  main_image_path: string;
  desc_images_path?: string[];
  is_deleted: boolean;
  status: ProductStatus;
}
export interface OrderDetailType {
  id: string;
  quantity: number;
  price_at_order: number;
  product: OrderProductType;
}

export interface OrderUserType {
  id: string;
  user_id: string;
  name: string;
  email: string;
  gender: Gender;
  phone_number: string;
  status: UserStatus;
}
export interface OrderType {
  id: string;
  user_id: string;
  status: OrderStatus;
  address: string;
  is_deleted: boolean;
  total_price: string;
  created_at: string;
  updated_at: string;
  user: OrderUserType;
  order_details: OrderDetailType[];
}

export interface OrdersInfoType {
  orders: OrderType[];
  pageInfo: PageInfo;
}

export interface ImageUploadProps {
  onImageSelect: (mainImage: string, descImages: string[]) => void;
  title: string;
  multiple: boolean;
}
