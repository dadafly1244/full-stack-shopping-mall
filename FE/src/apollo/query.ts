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

// export const USER_INFO_ADMIN = gql`
//   query userInfo {
//     usersList {
//       id
//       user_id
//       name
//       email
//       gender
//       phone_number
//       status
//       permissions
//       created_at
//       updated_at
//     }
//   }
// `;

// export const FILTERED_USER_INFO_ADMIN = gql`
//   query FilteredUserInfoAdmin($searchTerm: String!, $searchField: String!) {
//     filteredUsers(searchTerm: $searchTerm, searchField: $searchField) {
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

export const PAGINATED_USER_LIST = gql`
  query userInfo($page: Int!, $pageSize: Int!, $searchTerm: String, $searchField: String) {
    paginatedUsers(
      page: $page
      pageSize: $pageSize
      searchTerm: $searchTerm
      searchField: $searchField
    ) {
      users {
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
      pageInfo {
        currentPage
        pageSize
        totalCount
        totalPages
      }
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
        main_image_path
        desc_images_path
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
        desc_images_path
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
      desc_images_path
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

export const PRODUCT_DETAILS_USER = gql`
  query DetailsProductForHome($id: String!) {
    getProductDetailForHome(id: $id) {
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
  query GetAllOrders($page: Int!, $pageSize: Int!, $status: OrderStatus) {
    getAllOrders(page: $page, pageSize: $pageSize, status: $status) {
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
  query GetOrder($order_id: String!) {
    getOrder(order_id: $order_id) {
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

export const PAGINATED_REVIEWS = gql`
  query PaginatedReviews($page: Int!, $pageSize: Int!, $productId: String!, $isDeleted: Boolean) {
    paginatedReviews(
      page: $page
      pageSize: $pageSize
      productId: $productId
      isDeleted: $isDeleted
    ) {
      reviews {
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
        user {
          id
          user_id
          name
        }
        product {
          id
          name
        }
        parentReview {
          id
          title
        }
        childReviews {
          id
          user_id
          desc
          updated_at
          is_deleted
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

export const GET_SIGN_IN_USER_INFO = gql`
  query {
    myProfile {
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

export const GET_USER_CART = gql`
  query GetUserCart($user_id: String!) {
    getUserCart(user_id: $user_id) {
      id
      user_id
      created_at
      updated_at
      total_price
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
          status
          main_image_path
        }
      }
      user {
        id
        name
      }
    }
  }
`;

export const GET_USER_ORDERS = gql`
  query GetUserOrders($user_id: String!, $page: Int!, $pageSize: Int!) {
    getUserOrders(user_id: $user_id, page: $page, pageSize: $pageSize) {
      orders {
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
          product {
            name
            main_image_path
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

export const SEARCH_USER_ORDERS = gql`
  query SearchUserOrders(
    $user_id: String!
    $searchTerm: String!
    $page: Int!
    $pageSize: Int!
    $status: OrderStatus
  ) {
    searchUserOrders(
      user_id: $user_id
      searchTerm: $searchTerm
      page: $page
      pageSize: $pageSize
      status: $status
    ) {
      orders {
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
          product {
            name
            main_image_path
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

export const GET_USER_ORDER = gql`
  query GetUserOrder($user_id: String!, $order_id: String!) {
    getUserOrder(user_id: $user_id, order_id: $order_id) {
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
        product {
          id
          name
          main_image_path
          price
          sale
        }
      }
    }
  }
`;

// Admin Order Queries
export const GET_ALL_ORDERS_ADMIN = gql`
  query GetAllOrders($page: Int!, $pageSize: Int!, $status: OrderStatus) {
    getAllOrders(page: $page, pageSize: $pageSize, status: $status) {
      orders {
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
        user {
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

export const SEARCH_ORDERS_ADMIN = gql`
  query SearchOrders($searchTerm: String!) {
    searchOrders(searchTerm: $searchTerm) {
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
      user {
        id
        name
      }
    }
  }
`;

export const SEARCH_ORDER_BY_STATUS_ADMIN = gql`
  query SearchOrdersByStatus($status: OrderStatus!, $page: Int!, $pageSize: Int!) {
    searchOrdersByStatus(status: $status, page: $page, pageSize: $pageSize) {
      orders {
        id
        status
        total_price
        created_at
        user {
          name
          email
        }
        order_details {
          product {
            name
          }
          quantity
          price_at_order
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
