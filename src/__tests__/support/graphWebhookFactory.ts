import { Webhook } from "../../types";
import { graphQueryFactory } from '../../graphQueryFactory'

export function graphWebhookFactory(paramMapping = []): Webhook {
  return {
    version: "1.0",
    url: "https://fake.com",
    ipfsHash: "theIpfsHash",
    query: graphQueryFactory({
      websocketUri: "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d",
      subscriptionQuery: `
        subscription {
          tokens {
            id
            owner
          }
        }
      `
    }),
    paramMapping
  };
}
