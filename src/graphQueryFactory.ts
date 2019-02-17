import { GraphQuery } from './types'

export const graphQueryFactory = ({ subscriptionQuery, websocketUri }: { subscriptionQuery: string, websocketUri: string }):GraphQuery => ({
  queryType: "GraphQuery",
  subscriptionQuery,
  websocketUri,
});
