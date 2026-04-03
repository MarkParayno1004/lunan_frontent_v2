import { gql } from "@apollo/client";

export const ASSIGNMENTS_QUERY = gql`
  query Assignments {
    assignments {
      id
      task
      status
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
