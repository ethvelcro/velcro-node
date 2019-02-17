import Web3 from "web3";
import { EventQuery, Query, Webhook, QueryResult } from "./types";
import { LogManager } from './LogManager'

class Web3Consumer {
  public web3;

  constructor(web3: Object) {
    this.web3 = web3;
  }
}

export class WebhookListener extends Web3Consumer {
  public subscription: any;
  public fetch: Function;
  private logManager: LogManager;

  constructor(fetch: Function, web3: Object, logManager: LogManager) {
    super(web3);
    this.fetch = fetch;
    this.logManager = logManager;
  }

  public start(webhook: Webhook) {
    if (this.subscription) { throw new Error("we've already started"); }

    if (webhook.query.queryType === 'EventQuery') {
      const eventQuery: EventQuery = <EventQuery> webhook.query;
      const { address, topics } = eventQuery

      this.logManager.pushLog(webhook.ipfsHash, {
        type: "info",
        message: `Subscribing to ${address} with topics ${topics.join(', ')} for url ${webhook.url}`
      })

      this.subscription = this.web3.eth.subscribe("logs", {
        address: eventQuery.address
      });

      this.subscription.on("data", this.onData.bind(this, webhook));
      this.subscription.on("error", this.onError.bind(this, webhook));
    } else {
      throw new Error(`Unrecognized query type ${webhook.query.queryType}`)
    }
  }

  public onData(webhook: Webhook, log: any) {
    let result = this.formatResult(webhook, log);
    this.logManager.pushLog(webhook.ipfsHash, result);
    this.fetch(webhook.url, {
      method: "POST",
      body: JSON.stringify(result),
    }).catch(error => {
      console.error(error)
    });
  }

  public onError(webhook: Webhook, error: Error) {
    this.logManager.pushLog(webhook.ipfsHash, {
      type: "error",
      message: error.message
    });
    console.error(error);
  }

  public stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  public formatResult(webhook: Webhook, result: Object): QueryResult {
    return {
      webhook,
      result,
    };
  }
}
