import { enumType } from "nexus";

// Gender, UserStatus, UserPermissions enum 정의
export const GenderEnum = enumType({
  name: "Gender",
  members: ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"],
});

export const UserStatusEnum = enumType({
  name: "UserStatus",
  members: ["ACTIVE", "INACTIVE", "SUSPENDED"],
});

export const UserPermissionsEnum = enumType({
  name: "UserPermissions",
  members: ["USER", "ADMIN"],
});

export const ProductStatusEnum = enumType({
  name: "ProductStatus",
  members: [
    "AVAILABLE",
    "TEMPORARILY_OUT_OF_STOCK",
    "OUT_OF_STOCK",
    "DISCONTINUED", //단종
    "PROHIBITION_ON_SALE", // 판매금지
  ],
});

export const OrderStatusEnum = enumType({
  name: "OrderStatus",
  members: [
    "READY_TO_ORDER",
    "ORDER",
    "DELIVERED",
    "CANCELLED",
    "REFUND",
    "UNKNOWN",
  ],
});
