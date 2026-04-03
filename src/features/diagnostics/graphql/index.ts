import { gql } from "@apollo/client";

export const DIAGNOSTICS_QUERY = gql`
  query Diagnostics {
    diagnostics {
      id
      description
      createdAt
      patient {
        id
        user {
          firstName
          lastName
          email
        }
      }
      counselor {
        id
        user {
          firstName
          lastName
          email
        }
      }
    }
  }
`;
