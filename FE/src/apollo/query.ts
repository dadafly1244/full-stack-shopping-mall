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
    
  }
`;
