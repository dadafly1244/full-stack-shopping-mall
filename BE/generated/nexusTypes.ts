/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../src/apollo/context"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JSON";
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Upload";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSON";
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
    /**
     * The `Upload` scalar type represents a file upload.
     */
    upload<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Upload";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CategoryOrderByInput: { // input type
    id?: NexusGenEnums['SortOrder'] | null; // SortOrder
    name?: NexusGenEnums['SortOrder'] | null; // SortOrder
  }
}

export interface NexusGenEnums {
  Gender: "FEMALE" | "MALE" | "OTHER" | "PREFER_NOT_TO_SAY"
  OrderStatus: "CANCELLED" | "DELIVERED" | "ORDER" | "READY_TO_ORDER" | "REFUND" | "UNKNOWN"
  ProductStatus: "AVAILABLE" | "DISCONTINUED" | "OUT_OF_STOCK" | "PROHIBITION_ON_SALE" | "TEMPORARILY_OUT_OF_STOCK"
  SortOrder: "asc" | "desc"
  UserPermissions: "ADMIN" | "USER"
  UserStatus: "ACTIVE" | "INACTIVE" | "SUSPENDED"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: Date
  JSON: any
  Upload: Promise<File>
}

export interface NexusGenObjects {
  AuthPayload: { // root type
    refresh_token?: string | null; // String
    token?: string | null; // String
    user: NexusGenRootTypes['User']; // User!
  }
  Cart: { // root type
    count: number; // Int!
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    is_ordered: boolean; // Boolean!
    product_id: string; // String!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    user_id: string; // String!
  }
  Category: { // root type
    category_parent_id?: number | null; // Int
    id: number; // Int!
    name: string; // String!
  }
  CustomError: { // root type
    code: string; // String!
    message: string; // String!
  }
  Mutation: {};
  Order: { // root type
    address?: string | null; // String
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    is_deleted: boolean; // Boolean!
    status: NexusGenEnums['OrderStatus']; // OrderStatus!
    total_price: number; // Int!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    user_id: string; // String!
  }
  OrderDetail: { // root type
    id: number; // Int!
    order_id: string; // String!
    price_at_order: number; // Int!
    product_id: string; // String!
    quantity: number; // Int!
  }
  PageInfo: { // root type
    currentPage: number; // Int!
    pageSize: number; // Int!
    totalCount: number; // Int!
    totalPages: number; // Int!
  }
  PaginatedOrdersResult: { // root type
    orders: NexusGenRootTypes['Order'][]; // [Order!]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  PaginatedProductsResult: { // root type
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    products: NexusGenRootTypes['Product'][]; // [Product!]!
  }
  Product: { // root type
    count: number; // Int!
    created_at: NexusGenScalars['DateTime']; // DateTime!
    desc?: string | null; // String
    desc_images_path?: Array<string | null> | null; // [String]
    id: string; // ID!
    is_deleted: boolean; // Boolean!
    main_image_path?: string | null; // String
    name: string; // String!
    price: number; // Int!
    sale?: number | null; // Int
    status: NexusGenEnums['ProductStatus']; // ProductStatus!
    store_id: string; // String!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
  }
  ProductsResultFormHome: { // root type
    ad: NexusGenRootTypes['Product'][]; // [Product!]!
    event: NexusGenRootTypes['Product'][]; // [Product!]!
    new: NexusGenRootTypes['Product'][]; // [Product!]!
  }
  Query: {};
  Review: { // root type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    desc?: string | null; // String
    id: string; // ID!
    images_path?: NexusGenScalars['JSON'] | null; // JSON
    is_deleted: boolean; // Boolean!
    parent_review_id?: string | null; // String
    product_id: string; // String!
    score: number; // Float!
    title: string; // String!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    user_id: string; // String!
  }
  Store: { // root type
    business_registration_number: string; // String!
    desc?: string | null; // String
    id: string; // ID!
    name: string; // String!
  }
  User: { // root type
    created_at: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    gender: NexusGenEnums['Gender']; // Gender!
    id: string; // ID!
    name: string; // String!
    password: string; // String!
    permissions: NexusGenEnums['UserPermissions']; // UserPermissions!
    phone_number?: string | null; // String
    status: NexusGenEnums['UserStatus']; // UserStatus!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    user_id: string; // String!
  }
  UserBoolean: { // root type
    duplicated: boolean; // Boolean!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  AuthPayload: { // field return type
    refresh_token: string | null; // String
    token: string | null; // String
    user: NexusGenRootTypes['User']; // User!
  }
  Cart: { // field return type
    count: number; // Int!
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    is_ordered: boolean; // Boolean!
    orders: NexusGenRootTypes['Order'][]; // [Order!]!
    product: NexusGenRootTypes['Product']; // Product!
    product_id: string; // String!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    user_id: string; // String!
  }
  Category: { // field return type
    category_parent_id: number | null; // Int
    id: number; // Int!
    name: string; // String!
    parent: NexusGenRootTypes['Category'] | null; // Category
    products: NexusGenRootTypes['Product'][]; // [Product!]!
    subcategories: NexusGenRootTypes['Category'][]; // [Category!]!
  }
  CustomError: { // field return type
    code: string; // String!
    message: string; // String!
  }
  Mutation: { // field return type
    createCategory: NexusGenRootTypes['Category']; // Category!
    createOrder: NexusGenRootTypes['Order']; // Order!
    createProduct: NexusGenRootTypes['Product']; // Product!
    createStore: NexusGenRootTypes['Store'] | null; // Store
    createUser: NexusGenRootTypes['User']; // User!
    deleteCategory: boolean | null; // Boolean
    deleteOrder: NexusGenRootTypes['Order']; // Order!
    deleteProductIfUnused: NexusGenRootTypes['Product']; // Product!
    deleteStore: NexusGenRootTypes['Store'] | null; // Store
    mergeCategories: NexusGenRootTypes['Category']; // Category!
    refresh: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    renameCategory: NexusGenRootTypes['Category']; // Category!
    signin: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    signout: NexusGenRootTypes['User']; // User!
    signup: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    updateOrder: NexusGenRootTypes['Order']; // Order!
    updateOrderQuantity: NexusGenRootTypes['Order']; // Order!
    updateProduct: NexusGenRootTypes['Product']; // Product!
    updateProductStatus: NexusGenRootTypes['Product']; // Product!
    updateStore: NexusGenRootTypes['Store'] | null; // Store
    updateUser: NexusGenRootTypes['User']; // User!
    updateUserStateActive: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    updateUserStateSuspended: NexusGenRootTypes['AuthPayload']; // AuthPayload!
    uploadFile: boolean | null; // Boolean
    withdrawal: NexusGenRootTypes['AuthPayload'] | null; // AuthPayload
  }
  Order: { // field return type
    address: string | null; // String
    created_at: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    is_deleted: boolean; // Boolean!
    order_details: NexusGenRootTypes['OrderDetail'][]; // [OrderDetail!]!
    status: NexusGenEnums['OrderStatus']; // OrderStatus!
    total_price: number; // Int!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User']; // User!
    user_id: string; // String!
  }
  OrderDetail: { // field return type
    id: number; // Int!
    order: NexusGenRootTypes['Order']; // Order!
    order_id: string; // String!
    price_at_order: number; // Int!
    product: NexusGenRootTypes['Product']; // Product!
    product_id: string; // String!
    quantity: number; // Int!
  }
  PageInfo: { // field return type
    currentPage: number; // Int!
    pageSize: number; // Int!
    totalCount: number; // Int!
    totalPages: number; // Int!
  }
  PaginatedOrdersResult: { // field return type
    orders: NexusGenRootTypes['Order'][]; // [Order!]!
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
  }
  PaginatedProductsResult: { // field return type
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    products: NexusGenRootTypes['Product'][]; // [Product!]!
  }
  Product: { // field return type
    carts: NexusGenRootTypes['Cart'][]; // [Cart!]!
    categories: NexusGenRootTypes['Category'][]; // [Category!]!
    category: NexusGenRootTypes['Category'] | null; // Category
    count: number; // Int!
    created_at: NexusGenScalars['DateTime']; // DateTime!
    desc: string | null; // String
    desc_images_path: Array<string | null> | null; // [String]
    id: string; // ID!
    is_deleted: boolean; // Boolean!
    main_image_path: string | null; // String
    name: string; // String!
    price: number; // Int!
    reviews: NexusGenRootTypes['Review'][]; // [Review!]!
    sale: number | null; // Int
    status: NexusGenEnums['ProductStatus']; // ProductStatus!
    store: NexusGenRootTypes['Store'] | null; // Store
    store_id: string; // String!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
  }
  ProductsResultFormHome: { // field return type
    ad: NexusGenRootTypes['Product'][]; // [Product!]!
    event: NexusGenRootTypes['Product'][]; // [Product!]!
    new: NexusGenRootTypes['Product'][]; // [Product!]!
  }
  Query: { // field return type
    categories: NexusGenRootTypes['Category'][]; // [Category!]!
    category: NexusGenRootTypes['Category'] | null; // Category
    filteredUsers: Array<NexusGenRootTypes['User'] | null>; // [User]!
    getAllOrders: NexusGenRootTypes['PaginatedOrdersResult']; // PaginatedOrdersResult!
    getAllProducts: NexusGenRootTypes['PaginatedProductsResult']; // PaginatedProductsResult!
    getAllProductsForHomePage: NexusGenRootTypes['ProductsResultFormHome']; // ProductsResultFormHome!
    getOrder: NexusGenRootTypes['Order'] | null; // Order
    getProduct: NexusGenRootTypes['Product'] | null; // Product
    isDuplicated: NexusGenRootTypes['UserBoolean'] | null; // UserBoolean
    isDuplicatedBusinessNumber: boolean | null; // Boolean
    searchCategories: NexusGenRootTypes['Category'][]; // [Category!]!
    searchOrders: NexusGenRootTypes['Order'][]; // [Order!]!
    searchOrdersByStatus: NexusGenRootTypes['Order'][]; // [Order!]!
    searchProducts: NexusGenRootTypes['PaginatedProductsResult']; // PaginatedProductsResult!
    searchStores: Array<NexusGenRootTypes['Store'] | null> | null; // [Store]
    store: NexusGenRootTypes['Store'] | null; // Store
    stores: Array<NexusGenRootTypes['Store'] | null> | null; // [Store]
    usersList: Array<NexusGenRootTypes['User'] | null>; // [User]!
  }
  Review: { // field return type
    childReviews: Array<NexusGenRootTypes['Review'] | null> | null; // [Review]
    created_at: NexusGenScalars['DateTime']; // DateTime!
    desc: string | null; // String
    id: string; // ID!
    images_path: NexusGenScalars['JSON'] | null; // JSON
    is_deleted: boolean; // Boolean!
    parentReview: NexusGenRootTypes['Review'] | null; // Review
    parent_review_id: string | null; // String
    product: NexusGenRootTypes['Product'] | null; // Product
    product_id: string; // String!
    score: number; // Float!
    title: string; // String!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    user: NexusGenRootTypes['User'] | null; // User
    user_id: string; // String!
  }
  Store: { // field return type
    business_registration_number: string; // String!
    desc: string | null; // String
    id: string; // ID!
    name: string; // String!
    products: NexusGenRootTypes['Product'][] | null; // [Product!]
  }
  User: { // field return type
    carts: NexusGenRootTypes['Cart'][] | null; // [Cart!]
    created_at: NexusGenScalars['DateTime']; // DateTime!
    email: string; // String!
    gender: NexusGenEnums['Gender']; // Gender!
    id: string; // ID!
    name: string; // String!
    orders: NexusGenRootTypes['Order'][] | null; // [Order!]
    password: string; // String!
    permissions: NexusGenEnums['UserPermissions']; // UserPermissions!
    phone_number: string | null; // String
    reviews: NexusGenRootTypes['Review'][] | null; // [Review!]
    status: NexusGenEnums['UserStatus']; // UserStatus!
    updated_at: NexusGenScalars['DateTime']; // DateTime!
    user_id: string; // String!
  }
  UserBoolean: { // field return type
    duplicated: boolean; // Boolean!
  }
}

export interface NexusGenFieldTypeNames {
  AuthPayload: { // field return type name
    refresh_token: 'String'
    token: 'String'
    user: 'User'
  }
  Cart: { // field return type name
    count: 'Int'
    created_at: 'DateTime'
    id: 'String'
    is_ordered: 'Boolean'
    orders: 'Order'
    product: 'Product'
    product_id: 'String'
    updated_at: 'DateTime'
    user_id: 'String'
  }
  Category: { // field return type name
    category_parent_id: 'Int'
    id: 'Int'
    name: 'String'
    parent: 'Category'
    products: 'Product'
    subcategories: 'Category'
  }
  CustomError: { // field return type name
    code: 'String'
    message: 'String'
  }
  Mutation: { // field return type name
    createCategory: 'Category'
    createOrder: 'Order'
    createProduct: 'Product'
    createStore: 'Store'
    createUser: 'User'
    deleteCategory: 'Boolean'
    deleteOrder: 'Order'
    deleteProductIfUnused: 'Product'
    deleteStore: 'Store'
    mergeCategories: 'Category'
    refresh: 'AuthPayload'
    renameCategory: 'Category'
    signin: 'AuthPayload'
    signout: 'User'
    signup: 'AuthPayload'
    updateOrder: 'Order'
    updateOrderQuantity: 'Order'
    updateProduct: 'Product'
    updateProductStatus: 'Product'
    updateStore: 'Store'
    updateUser: 'User'
    updateUserStateActive: 'AuthPayload'
    updateUserStateSuspended: 'AuthPayload'
    uploadFile: 'Boolean'
    withdrawal: 'AuthPayload'
  }
  Order: { // field return type name
    address: 'String'
    created_at: 'DateTime'
    id: 'String'
    is_deleted: 'Boolean'
    order_details: 'OrderDetail'
    status: 'OrderStatus'
    total_price: 'Int'
    updated_at: 'DateTime'
    user: 'User'
    user_id: 'String'
  }
  OrderDetail: { // field return type name
    id: 'Int'
    order: 'Order'
    order_id: 'String'
    price_at_order: 'Int'
    product: 'Product'
    product_id: 'String'
    quantity: 'Int'
  }
  PageInfo: { // field return type name
    currentPage: 'Int'
    pageSize: 'Int'
    totalCount: 'Int'
    totalPages: 'Int'
  }
  PaginatedOrdersResult: { // field return type name
    orders: 'Order'
    pageInfo: 'PageInfo'
  }
  PaginatedProductsResult: { // field return type name
    pageInfo: 'PageInfo'
    products: 'Product'
  }
  Product: { // field return type name
    carts: 'Cart'
    categories: 'Category'
    category: 'Category'
    count: 'Int'
    created_at: 'DateTime'
    desc: 'String'
    desc_images_path: 'String'
    id: 'ID'
    is_deleted: 'Boolean'
    main_image_path: 'String'
    name: 'String'
    price: 'Int'
    reviews: 'Review'
    sale: 'Int'
    status: 'ProductStatus'
    store: 'Store'
    store_id: 'String'
    updated_at: 'DateTime'
  }
  ProductsResultFormHome: { // field return type name
    ad: 'Product'
    event: 'Product'
    new: 'Product'
  }
  Query: { // field return type name
    categories: 'Category'
    category: 'Category'
    filteredUsers: 'User'
    getAllOrders: 'PaginatedOrdersResult'
    getAllProducts: 'PaginatedProductsResult'
    getAllProductsForHomePage: 'ProductsResultFormHome'
    getOrder: 'Order'
    getProduct: 'Product'
    isDuplicated: 'UserBoolean'
    isDuplicatedBusinessNumber: 'Boolean'
    searchCategories: 'Category'
    searchOrders: 'Order'
    searchOrdersByStatus: 'Order'
    searchProducts: 'PaginatedProductsResult'
    searchStores: 'Store'
    store: 'Store'
    stores: 'Store'
    usersList: 'User'
  }
  Review: { // field return type name
    childReviews: 'Review'
    created_at: 'DateTime'
    desc: 'String'
    id: 'ID'
    images_path: 'JSON'
    is_deleted: 'Boolean'
    parentReview: 'Review'
    parent_review_id: 'String'
    product: 'Product'
    product_id: 'String'
    score: 'Float'
    title: 'String'
    updated_at: 'DateTime'
    user: 'User'
    user_id: 'String'
  }
  Store: { // field return type name
    business_registration_number: 'String'
    desc: 'String'
    id: 'ID'
    name: 'String'
    products: 'Product'
  }
  User: { // field return type name
    carts: 'Cart'
    created_at: 'DateTime'
    email: 'String'
    gender: 'Gender'
    id: 'ID'
    name: 'String'
    orders: 'Order'
    password: 'String'
    permissions: 'UserPermissions'
    phone_number: 'String'
    reviews: 'Review'
    status: 'UserStatus'
    updated_at: 'DateTime'
    user_id: 'String'
  }
  UserBoolean: { // field return type name
    duplicated: 'Boolean'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createCategory: { // args
      name: string; // String!
      parentId?: number | null; // Int
    }
    createOrder: { // args
      address?: string | null; // String
      product_ids: string[]; // [String!]!
      quantities: number[]; // [Int!]!
      status: NexusGenEnums['OrderStatus']; // OrderStatus!
      user_id: string; // String!
    }
    createProduct: { // args
      category_id: number; // Int!
      count?: number | null; // Int
      desc?: string | null; // String
      desc_images_path?: NexusGenScalars['Upload'][] | null; // [Upload!]
      is_deleted?: boolean | null; // Boolean
      main_image_path: NexusGenScalars['Upload']; // Upload!
      name: string; // String!
      price: number; // Int!
      sale?: number | null; // Int
      status: NexusGenEnums['ProductStatus']; // ProductStatus!
      store_id: string; // String!
    }
    createStore: { // args
      business_registration_number: string; // String!
      desc?: string | null; // String
      name: string; // String!
    }
    createUser: { // args
      email: string; // String!
      gender: NexusGenEnums['Gender']; // Gender!
      name: string; // String!
      password: string; // String!
      permissions: NexusGenEnums['UserPermissions']; // UserPermissions!
      phone_number?: string | null; // String
      status: NexusGenEnums['UserStatus']; // UserStatus!
      user_id: string; // String!
    }
    deleteCategory: { // args
      categoryId: number; // Int!
    }
    deleteOrder: { // args
      id: string; // String!
    }
    deleteProductIfUnused: { // args
      id: string; // String!
    }
    deleteStore: { // args
      id: string; // String!
    }
    mergeCategories: { // args
      categoryId1: number; // Int!
      categoryId2: number; // Int!
      newName: string; // String!
    }
    refresh: { // args
      refresh_token: string; // String!
    }
    renameCategory: { // args
      categoryId: number; // Int!
      newName: string; // String!
    }
    signin: { // args
      password: string; // String!
      user_id: string; // String!
    }
    signout: { // args
      id: string; // String!
    }
    signup: { // args
      email: string; // String!
      gender: NexusGenEnums['Gender']; // Gender!
      name: string; // String!
      password: string; // String!
      permissions: NexusGenEnums['UserPermissions']; // UserPermissions!
      phone_number?: string | null; // String
      status: NexusGenEnums['UserStatus']; // UserStatus!
      user_id: string; // String!
    }
    updateOrder: { // args
      address?: string | null; // String
      id: string; // String!
      status: string; // String!
    }
    updateOrderQuantity: { // args
      newQuantity: number; // Int!
      orderId: string; // String!
      productId: string; // String!
    }
    updateProduct: { // args
      category_id?: number | null; // Int
      count?: number | null; // Int
      desc?: string | null; // String
      desc_images_path?: NexusGenScalars['Upload'][] | null; // [Upload!]
      id: string; // String!
      main_image_path?: NexusGenScalars['Upload'] | null; // Upload
      name?: string | null; // String
      price?: number | null; // Int
      sale?: number | null; // Int
    }
    updateProductStatus: { // args
      id: string; // String!
      status: NexusGenEnums['ProductStatus']; // ProductStatus!
    }
    updateStore: { // args
      business_registration_number?: string | null; // String
      desc?: string | null; // String
      id: string; // String!
      name?: string | null; // String
    }
    updateUser: { // args
      email?: string | null; // String
      gender?: NexusGenEnums['Gender'] | null; // Gender
      id: string; // String!
      name?: string | null; // String
      permissions?: NexusGenEnums['UserPermissions'] | null; // UserPermissions
      phone_number?: string | null; // String
      user_id?: string | null; // String
    }
    updateUserStateActive: { // args
      id: string; // String!
    }
    updateUserStateSuspended: { // args
      id: string; // String!
    }
    uploadFile: { // args
      file?: NexusGenScalars['Upload'] | null; // Upload
    }
    withdrawal: { // args
      password: string; // String!
      user_id: string; // String!
    }
  }
  Query: {
    categories: { // args
      includeHierarchy?: boolean | null; // Boolean
      orderBy?: NexusGenInputs['CategoryOrderByInput'] | null; // CategoryOrderByInput
    }
    category: { // args
      id: number; // Int!
      includeHierarchy?: boolean | null; // Boolean
    }
    filteredUsers: { // args
      searchField: string; // String!
      searchTerm: string; // String!
    }
    getAllOrders: { // args
      page: number; // Int!
      pageSize: number; // Int!
    }
    getAllProducts: { // args
      page: number; // Int!
      pageSize: number; // Int!
    }
    getAllProductsForHomePage: { // args
      category?: string | null; // String
    }
    getOrder: { // args
      id: string; // String!
    }
    getProduct: { // args
      id: string; // String!
    }
    isDuplicated: { // args
      email?: string | null; // String
      user_id?: string | null; // String
    }
    isDuplicatedBusinessNumber: { // args
      business_registration_number?: string | null; // String
    }
    searchCategories: { // args
      includeHierarchy?: boolean | null; // Boolean
      nameContains: string; // String!
    }
    searchOrders: { // args
      searchTerm: string; // String!
    }
    searchOrdersByStatus: { // args
      status?: NexusGenEnums['OrderStatus'] | null; // OrderStatus
    }
    searchProducts: { // args
      field?: string | null; // String
      page: number; // Int!
      pageSize: number; // Int!
      searchTerm?: string | null; // String
      store_id?: string | null; // String
    }
    searchStores: { // args
      searchTerm: string; // String!
    }
    store: { // args
      id: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}