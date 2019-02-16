export interface Webhook {
  version: string;
  url: string;
  query: Query;
}

export interface Query {
  queryType: string;
}

export interface EventQuery extends Query {
  address: string;
  topics: String[];
}

export interface QueryResult {
  webhook: Webhook;
  result: Object;
}
