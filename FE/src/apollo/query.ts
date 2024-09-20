import { gql } from "@apollo/client";

export const CHECK_ID = gql`
  query CheckIdDuplication($user_id: String) {
    isDuplicated(user_id: $user_id) {
      duplicated
    }
  }
`;

export const CHECK_EMAIL = gql`
  query CheckEmailDuplication($email: String) {
    isDuplicated(email: $email) {
      duplicated
    }
  }
`;

export const USER_INFO_ADMIN = gql`
  query userInfo {
    usersList {
      id
      user_id
      name
      email
      gender
      phone_number
      status
      permissions
      created_at
      updated_at
    }
  }
`;

// export const FILTERED_USER_INFO_ADMIN = gql`
//   query FilteredUsers($searchTerm: String!) {
//     filteredUsers(searchTerm: $searchTerm) {
//       id
//       name
//       user_id
//       email
//       phone_number
//       status
//       permissions
//       gender
//       created_at
//       updated_at
//     }
//   }
// `;

export const FILTERED_USER_INFO_ADMIN = gql`
  query FilteredUserInfoAdmin($searchTerm: String!, $searchField: String!) {
    filteredUsers(searchTerm: $searchTerm, searchField: $searchField) {
      id
      name
      user_id
      email
      phone_number
      status
      permissions
      gender
      created_at
      updated_at
    }
  }
`;

export const PRODUCT_SEARCH_ADMIN = gql`
  query SearchProducts(
    $searchTerm: String
    $field: String
    $store_id: String
    $page: Int!
    $pageSize: Int!
  ) {
    searchProducts(
      searchTerm: $searchTerm
      field: $field
      store_id: $store_id
      page: $page
      pageSize: $pageSize
    ) {
      products {
        id
        name
        desc
        price
        sale
        count
        is_deleted
        status
        created_at
        updated_at
        category {
          id
          name
        }
        store {
          id
          name
        }
      }
      pageInfo {
        currentPage
        pageSize
        totalCount
        totalPages
      }
    }
  }
`;
export const PRODUCTS_INFO_ADMIN = gql`
  query Products($page: Int!, $pageSize: Int!) {
    getAllProducts(page: $page, pageSize: $pageSize) {
      products {
        id
        name
        desc
        price
        sale
        count
        is_deleted
        status
        main_image_path
        # desc_images_path
        store_id
        created_at
        updated_at
        store {
          id
          name
        }
        category {
          id
          name
        }
      }
      pageInfo {
        currentPage
        pageSize
        totalCount
        totalPages
      }
    }
  }
`;
export const PRODUCT_DETAILS_ADMIN = gql`
  query DetailsProduct($id: String!) {
    getProduct(id: $id) {
      id
      name
      desc
      price
      sale
      count
      is_deleted
      status
      main_image_path
      # desc_images_path
      created_at
      updated_at
      store_id
      store {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`;

// 전체 카테고리 조회
export const GET_ALL_CATEGORIES = gql`
  query GetCategories($includeHierarchy: Boolean!, $orderBy: CategoryOrderByInput) {
    categories(includeHierarchy: $includeHierarchy, orderBy: $orderBy) {
      id
      name
      subcategories @include(if: $includeHierarchy) {
        id
        name
        subcategories {
          id
          name
          subcategories {
            id
            name
          }
        }
      }
    }
  }
`;

// 단일 카테고리 조회
export const GET_CATEGORY = gql`
  query GetCategory($id: Int!, $includeHierarchy: Boolean) {
    category(id: $id, includeHierarchy: $includeHierarchy) {
      id
      name
      parent @include(if: $includeHierarchy) {
        id
        name
      }
      subcategories @include(if: $includeHierarchy) {
        id
        name
        subcategories {
          id
          name
          subcategories {
            id
            name
          }
        }
      }
    }
  }
`;

// 카테고리 이름 검색
export const SEARCH_CATEGORIES = gql`
  query SearchCategories($nameContains: String!, $includeHierarchy: Boolean) {
    searchCategories(nameContains: $nameContains, includeHierarchy: $includeHierarchy) {
      id
      name
      parent @include(if: $includeHierarchy) {
        id
        name
      }
      subcategories @include(if: $includeHierarchy) {
        id
        name
        subcategories {
          id
          name
          subcategories {
            id
            name
          }
        }
      }
    }
  }
`;

// 전체 주문 조회
export const GET_ALL_ORDERS = gql`
  query GetAllOrders($page: Int!, $pageSize: Int!) {
    getAllOrders(page: $page, pageSize: $pageSize) {
      orders {
        id
        user_id
        status
        address
        is_deleted
        total_price
        created_at
        updated_at
        user {
          id
          user_id
          name
          email
          gender
          phone_number
          status
        }
        order_details {
          id
          quantity
          price_at_order
          product {
            id
            name
            sale
            price
            desc
            main_image_path
            # desc_images_path
            is_deleted
            status
          }
        }
      }
      pageInfo {
        currentPage
        pageSize
        totalCount
        totalPages
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: String!) {
    getOrder(id: $id) {
      id
      user_id
      status
      address
      is_deleted
      total_price
      created_at
      updated_at
      user {
        id
        user_id
        name
        email
        gender
        phone_number
        status
      }
      order_details {
        id
        quantity
        price_at_order
        product {
          id
          name
          sale
          price
          desc
          main_image_path
          # desc_images_path
          is_deleted
          status
        }
      }
    }
  }
`;

export const SEARCH_ORDER = gql`
  query SearchOrder($searchTerm: String!) {
    searchOrders(searchTerm: $searchTerm) {
      id
      user_id
      status
      address
      is_deleted
      total_price
      created_at
      updated_at
      user {
        id
        user_id
        name
        email
        gender
        phone_number
        status
      }
      order_details {
        id
        quantity
        price_at_order
        product {
          id
          name
          sale
          price
          desc
          main_image_path
          # desc_images_path
          is_deleted
          status
        }
      }
    }
  }
`;

export const SEARCH_ORDER_BY_STATUS = gql`
  query GetAllOrders($status: OrderStatus!) {
    searchOrders(status: $status) {
      id
      user_id
      status
      address
      is_deleted
      total_price
      created_at
      updated_at
      user {
        id
        user_id
        name
        email
        password
        gender
        phone_number
        status
      }
      order_details {
        id
        quantity
        price_at_order
        product {
          id
          name
          sale
          price
          desc
          main_image_path
          # desc_images_path
          is_deleted
          status
        }
      }
    }
  }
`;

export const HOME_QUERY = gql`
  query GetAllProductsForHomePage($category: String) {
    getAllProductsForHomePage(category: $category) {
      ad {
        id
        name
        sale
        price
        desc
        main_image_path
        desc_images_path
        is_deleted
        status
      }
      new {
        id
        name
        sale
        price
        desc
        main_image_path
        desc_images_path
        is_deleted
        status
        created_at
        updated_at
      }
      event {
        id
        name
        sale
        price
        desc
        main_image_path
        desc_images_path
        is_deleted
        status
      }
    }
  }
`;
