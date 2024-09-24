import { gql } from "@apollo/client";
export enum Gender {
  MALE,
  FEMALE,
  OTHER,
  PREFER_NOT_TO_SAY,
}

export enum UserStatus {
  ACTIVE,
  INACTIVE,
  SUSPENDED,
}

export enum UserPermissions {
  ADMIN,
  USER,
}

export enum ProductStatus {
  AVAILABLE,
  TEMPORARILY_OUT_OF_STOCK,
  OUT_OF_STOCK,
  DISCONTINUED,
  PROHIBITION_ON_SALE,
}

export const SIGN_IN_USER = gql`
  mutation signin($user_id: String!, $password: String!) {
    signin(user_id: $user_id, password: $password) {
      token
      refresh_token
      user {
        name
        gender
        user_id
      }
    }
  }
`;

export const SIGN_UP_USER = gql`
  mutation signup(
    $name: String!
    $user_id: String!
    $email: String!
    $password: String!
    $gender: Gender!
    $phone_number: String
    $status: UserStatus!
    $permissions: UserPermissions!
  ) {
    signup(
      email: $email
      user_id: $user_id
      name: $name
      password: $password
      gender: $gender
      phone_number: $phone_number
      status: $status
      permissions: $permissions
    ) {
      token
      refresh_token
      user {
        name
        user_id
      }
    }
  }
`;

export const USER_PROFILE = gql`
  mutation userProfile($user_id: String!, $password: String!) {
    signin(user_id: $user_id, password: $password) {
      token
      refresh_token
      user {
        name
        user_id
        email
        phone_number
        gender
        status
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refresh(refresh_token: $refreshToken) {
      token
      refresh_token
      user {
        id
        permissions
      }
    }
  }
`;

export const SUSPENDED_USER_ADMIN = gql`
  mutation SuspendedUser($id: String!) {
    updateUserStateSuspended(id: $id) {
      user {
        status
      }
    }
  }
`;

export const ACTIVE_USER_ADMIN = gql`
  mutation ActiveUser($id: String!) {
    updateUserStateActive(id: $id) {
      user {
        status
      }
    }
  }
`;

export const UPDATE_USER_ADMIN = gql`
  mutation UpdateUser(
    $id: String!
    $name: String
    $user_id: String
    $email: String
    $gender: Gender
    $phone_number: String
    $permissions: UserPermissions
  ) {
    updateUser(
      id: $id
      email: $email
      user_id: $user_id
      name: $name
      gender: $gender
      phone_number: $phone_number
      permissions: $permissions
    ) {
      id
      user_id
      email
      name
      gender
      phone_number
      permissions
    }
  }
`;

export const SIGNOUT_USER_ADMIN = gql`
  mutation SignOutUser($id: String!) {
    signout(id: $id) {
      id
    }
  }
`;

export const CREATE_PRODUCT_ADMIN = gql`
  mutation CreateProduct(
    $name: String!
    $desc: String
    $price: Int!
    $sale: Int
    $count: Int
    $is_deleted: Boolean
    $status: ProductStatus!
    $main_image_path: Upload!
    $desc_images_path: [Upload!]
    $category_id: Int!
    $store_id: String!
  ) {
    createProduct(
      name: $name
      desc: $desc
      price: $price
      sale: $sale
      count: $count
      is_deleted: $is_deleted
      status: $status
      main_image_path: $main_image_path
      desc_images_path: $desc_images_path
      category_id: $category_id
      store_id: $store_id
    ) {
      id
      name
      desc
      price
      sale
      count
      is_deleted
      status
      main_image_path
      desc_images_path
      created_at
      updated_at
      store {
        id
        business_registration_number
        name
      }
      category {
        id
        name
      }
    }
  }
`;
export const UPDATE_PRODUCT_STATUS_ADMIN = gql`
  mutation UpdateProductStatus($id: String!, $status: ProductStatus!) {
    updateProductStatus(id: $id, status: $status) {
      id
      name
      desc
      price
      sale
      count
      is_deleted
      status
      # main_image_path
      # desc_images_path
      created_at
      updated_at
      category {
        id
        name
      }
      store {
        id
        business_registration_number
        name
      }
    }
  }
`;
export const UPDATE_PRODUCT_ADMIN = gql`
  mutation UpdateProduct(
    $id: String!
    $name: String!
    $desc: String
    $price: Int!
    $sale: Int
    $count: Int
    $main_image_path: Upload
    $desc_images_path: [Upload!]
    $category_id: Int!
  ) {
    updateProduct(
      id: $id
      name: $name
      desc: $desc
      price: $price
      sale: $sale
      count: $count
      main_image_path: $main_image_path
      desc_images_path: $desc_images_path
      category_id: $category_id
    ) {
      id
      name
      desc
      price
      sale
      count
      is_deleted
      status
      main_image_path
      desc_images_path
      created_at
      updated_at
      store {
        id
        business_registration_number
        name
      }
      category {
        id
        name
      }
    }
  }
`;
export const DELETE_PRODUCT_ADMIN = gql`
  mutation DeleteProduct($id: String!) {
    deleteProductIfUnused(id: $id) {
      id
    }
  }
`;

// 카테고리 생성
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!, $parentId: Int) {
    createCategory(name: $name, parentId: $parentId) {
      id
      name
      category_parent_id
    }
  }
`;

// 카테고리 병합
export const MERGE_CATEGORIES = gql`
  mutation MergeCategories($categoryId1: Int!, $categoryId2: Int!, $newName: String!) {
    mergeCategories(categoryId1: $categoryId1, categoryId2: $categoryId2, newName: $newName) {
      id
      name
      subcategories {
        id
        name
      }
    }
  }
`;

// 카테고리 이름 변경
export const RENAME_CATEGORY = gql`
  mutation RenameCategory($categoryId: Int!, $newName: String!) {
    renameCategory(categoryId: $categoryId, newName: $newName) {
      id
      name
      subcategories {
        id
        name
      }
      products {
        id
        name
      }
    }
  }
`;

// 카테고리 삭제
export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($categoryId: Int!) {
    deleteCategory(categoryId: $categoryId)
  }
`;

// 파일 업로드 mutation
export const UPLOAD_FILES = gql`
  mutation UploadFiles($files: [Upload!]!) {
    uploadFiles(files: $files) {
      filename
      mimetype
      encoding
      url
    }
  }
`;
