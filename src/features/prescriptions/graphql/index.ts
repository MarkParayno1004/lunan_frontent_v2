import { gql } from "@apollo/client";

export const PRESCRIPTIONS_QUERY = gql`
  query Prescriptions {
    prescriptions {
      id
      prescribedMedicine
      createdAt
      counselor {
        id
        user {
          firstName
          lastName
        }
      }
      patient {
        id
        user {
          firstName
          lastName
        }
      }
    }
  }
`;
