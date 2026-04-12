import { gql } from "@apollo/client";

export const CHAT_USERS_QUERY = gql`
  query ChatUsers {
    counselors {
      id
      specialization
      licenseNo
      user {
        id
        firstName
        lastName
        email
        role
        contactNo
      }
    }
    patients {
      id
      user {
        id
        firstName
        lastName
        email
        role
        contactNo
      }
    }
    users {
      id
      firstName
      lastName
      email
      role
    }
  }
`;
