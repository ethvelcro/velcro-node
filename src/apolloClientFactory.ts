import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';

export function apolloClientFactory(uri: string) {
  const link = new WebSocketLink({
    uri,
    options: {
      reconnect: true
    }
  });

  const cache = new InMemoryCache()

  return new ApolloClient({
    link,
    cache
  });
}
