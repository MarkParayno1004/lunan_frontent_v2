"use client";

import { HttpLink } from "@apollo/client";
import { ApolloLink } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";
import { getCsrfToken } from "@/lib/csrf";

const graphqlUrl =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:8000/graphql";

function makeClient() {
  const httpLink = new HttpLink({
    uri: graphqlUrl,
    credentials: "include",
  });

  const csrfLink = setContext(async (_, context) => {
    const csrfToken = await getCsrfToken();

    return {
      headers: {
        ...context.headers,
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
      },
      fetchOptions: {
        ...(context.fetchOptions ?? {}),
        credentials: "include",
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      csrfLink,
      new SSRMultipartLink({
        stripDefer: true,
        cutoffDelay: 100,
      }),
      httpLink,
    ]),
  });
}

type ApolloProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function ApolloProvider({ children }: ApolloProviderProps) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
