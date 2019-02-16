import { Webhook } from "../../types";
import { eventQueryFactory } from '../../eventQueryFactory'

export function webhookFactory(): Webhook {
  return {
    version: "1.0",
    url: "https://fake.com",
    query: eventQueryFactory({
      address: "0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d",
      topics: ["0x1234", null, "0xabcdef", "0x9999"],
    }),
  };
}
