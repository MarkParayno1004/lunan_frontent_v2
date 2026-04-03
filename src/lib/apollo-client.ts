import { HttpLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";

const graphqlUrl =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:8000/graphql";

function createApolloClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new SSRMultipartLink({
      stripDefer: true,
      cutoffDelay: 100,
    }).concat(
      new HttpLink({
        uri: graphqlUrl,
        credentials: "include",
      }),
    ),
  });
}

export const { getClient, query, PreloadQuery } =
  registerApolloClient(createApolloClient);
