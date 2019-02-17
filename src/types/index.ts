export interface Webhook {
  version: string;
  ipfsHash: string;
  url: string;
  query: Query;
  paramMapping: Array<QueryParamMapping>;
}

export interface QueryParamMapping {
  paramName: string,
  resultPath: string
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
