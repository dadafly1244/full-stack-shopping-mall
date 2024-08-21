import { gql } from "@apollo/client";

export const CHECK_ID = gql`
  query isDuplicated($user_id: String!) {
    isDuplicated(user_id: $user_id) {
      duplicated
    }
  }
`;

export const CHECK_EMAIL = gql`
  query isDuplicated($email: String!) {
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

export const FILTERED_USER_INFO_ADMIN = gql`
  query filteredUserInfo(
    $name: String
    $user_id: String
    $email: String
    $phone_number: String
    $status: UserStatus
    $permissions: UserPermissions
    $gender: Gender
  ) {
    filteredUsers(
      name: $name
      user_id: $user_id
      email: $email
      phone_number: $phone_number
      status: $status
      permissions: $permissions
      gender: $gender
    ) {
      user {
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
  }
`;
