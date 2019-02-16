import Web3 from "web3";
import { EventQuery, Query, Webhook, QueryResult } from "./types";

class Web3Consumer {
  public web3;

  constructor(web3: Object) { // TODO Use web3 type
    this.web3 = web3;
  }
}

export class WebhookListener extends Web3Consumer {
  public subscription: any;
  public fetch: Function;

  constructor(fetch: Function, web3: Object) {
    super(web3);
    this.fetch = fetch;
  }

  public start(webhook: Webhook) {
    if (this.subscription) { throw new Error("we've already started"); }

    if (webhook.query.queryType === 'EventQuery') {
      const eventQuery: EventQuery = <EventQuery> webhook.query;

      this.subscription = this.web3.eth.subscribe("logs", {
        address: eventQuery.address,
        topics: eventQuery.topics,
      });

      this.subscription.on("data", this.onData.bind(this, webhook));
      this.subscription.on("changed", this.onChanged.bind(this, webhook));
      this.subscription.on("error", this.onError.bind(this, webhook));
    } else {
      throw new Error(`Unrecognized query type ${webhook.query.queryType}`)
    }
  }

  public onData(webhook: Webhook, log: Object) {
    this.fetch(webhook.url, {
      method: "POST",
      body: JSON.stringify(this.formatRequest(webhook, log)),
    });
  }

  public onChanged(webhook: Webhook, log: Object) {
    this.fetch(webhook.url, {
      method: "POST",
      body: JSON.stringify(this.formatRequest(webhook, log)),
    });
  }

  public onError(webhook: Webhook, error: Error) {
    console.error(error);
  }

  public stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  public formatRequest(webhook: Webhook, result: Object): QueryResult {
    return {
      webhook,
      result,
    };
  }
}
