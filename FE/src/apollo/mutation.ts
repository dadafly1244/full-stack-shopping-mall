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
