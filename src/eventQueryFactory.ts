import { EventQuery } from './types'

export const eventQueryFactory = ({ address, topics }: { address: string, topics: Array<string> }):EventQuery => ({
  queryType: "EventQuery",
  address,
  topics,
});
