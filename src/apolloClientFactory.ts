import { WebSocketLink } from 'apollo-link-ws';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';

export function apolloClientFactory(uri: string) {
  const wsLink = new WebSocketLink({
    uri,
    options: {
      reconnect: true
    }
  });

  return new ApolloClient({
    link
  });
}
