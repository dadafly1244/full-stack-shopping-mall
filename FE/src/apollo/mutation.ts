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

// Mutations
export const CREATE_REVIEW = gql`
  mutation CreateReview(
    $title: String!
    $desc: String
    $score: Float!
    $images_path: Upload
    $product_id: String!
    $parent_review_id: String
    $user_id: String!
  ) {
    createReview(
      title: $title
      desc: $desc
      score: $score
      images_path: $images_path
      product_id: $product_id
      parent_review_id: $parent_review_id
      user_id: $user_id
    ) {
      id
      title
      desc
      score
      images_path
      is_deleted
      user_id
      product_id
      parent_review_id
      created_at
      updated_at
    }
  }
`;

export const USER_UPDATE_REVIEW = gql`
  mutation UpdateReview(
    $id: ID!
    $title: String
    $desc: String
    $score: Float
    $images_path: Upload
    $user_id: String!
  ) {
    updateReview(
      id: $id
      title: $title
      desc: $desc
      score: $score
      images_path: $images_path
      user_id: $user_id
    ) {
      id
      title
      desc
      score
      images_path
      is_deleted
      user_id
      product_id
      parent_review_id
      created_at
      updated_at
    }
  }
`;

export const ADMIN_MANAGE_REVIEW = gql`
  mutation AdminManageReview($id: ID!, $is_deleted: Boolean!) {
    adminManageReviewSoftDelete(id: $id, is_deleted: $is_deleted) {
      id
      is_deleted
    }
  }
`;

export const UPDATE_USER_My_PROFILE = gql`
  mutation UpdateMyProfile(
    $user_id: String
    $currentPassword: String
    $newPassword: String
    $name: String
    $email: String
    $gender: Gender
    $phone_number: String
  ) {
    updateMyProfile(
      user_id: $user_id
      currentPassword: $currentPassword
      newPassword: $newPassword
      name: $name
      email: $email
      gender: $gender
      phone_number: $phone_number
    ) {
      id
      user_id
      name
      email
      gender
      phone_number
    }
  }
`;

export const WITHDRAWAL_USER = gql`
  mutation WithdrawalUser($user_id: String!, $password: String!) {
    withdrawal(user_id: $user_id, password: $password) {
      id
      name
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($user_id: String!, $product_id: String!, $quantity: Int!) {
    addToCart(user_id: $user_id, product_id: $product_id, quantity: $quantity) {
      id
      user_id
      user {
        name
      }
      total_price
      updated_at
      items {
        id
        product_id
        quantity
        created_at
        updated_at
        product {
          id
          name
          price
          sale
          main_image_path
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM_QUANTITY = gql`
  mutation UpdateCartItemQuantity($cart_item_id: ID!, $quantity: Int!) {
    updateCartItemQuantity(cart_item_id: $cart_item_id, quantity: $quantity) {
      id
      product_id
      quantity
      created_at
      updated_at
      product {
        id
        name
        price
        sale
        main_image_path
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($cart_item_id: ID!) {
    removeFromCart(cart_item_id: $cart_item_id) {
      id
    }
  }
`;

export const CREATE_ORDER_FROM_CART = gql`
  mutation CreateOrderFromCart($cart_id: String!, $address: String!) {
    createOrderFromCart(cart_id: $cart_id, address: $address) {
      id
      user_id
      status
      address
      total_price
      created_at
      updated_at
      order_details {
        id
        order_id
        product_id
        quantity
        price_at_order
      }
    }
  }
`;

export const CREATE_ORDER_FROM_CART_ITEM = gql`
  mutation CreateOrderFromCartItem($cart_id: String!, $cart_item_id: String!, $address: String!) {
    createOrderFromCartItem(cart_id: $cart_id, cart_item_id: $cart_item_id, address: $address) {
      id
      user_id
      status
      address
      total_price
      created_at
      updated_at
      order_details {
        id
        order_id
        product_id
        quantity
        price_at_order
      }
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($user_id: String!, $order_id: String!) {
    cancelOrder(user_id: $user_id, order_id: $order_id) {
      id
      status
    }
  }
`;

export const UPDATE_ORDER_STATUS_ADMIN = gql`
  mutation UpdateOrderStatus($order_id: String!, $status: OrderStatus!) {
    updateOrderStatus(order_id: $order_id, status: $status) {
      id
      status
      updated_at
    }
  }
`;

export const DELETE_ORDER_ADMIN = gql`
  mutation DeleteOrder($orderId: String!) {
    deleteOrder(orderId: $orderId) {
      id
      is_deleted
      updated_at
    }
  }
`;
