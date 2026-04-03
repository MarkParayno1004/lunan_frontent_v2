import { gql } from "@apollo/client";

export const USER_LOGIN_MUTATION = gql`
  mutation UserLogin($loginUser: LoginUserInput!) {
    userLogin(loginUser: $loginUser) {
      token
      user {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;
