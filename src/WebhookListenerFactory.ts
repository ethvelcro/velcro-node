import { WebhookListener } from './WebhookListener';
import { SubscriptionListener } from './SubscriptionListener';
import { IWebhookListener } from './IWebhookListener';
import { LogManager } from './LogManager';
import fetch from 'node-fetch';

export class WebhookListenerFactory {
  private web3: any;
  private logManager: LogManager;

  constructor(web3: any, logManager: LogManager) {
    this.web3 = web3;
    this.logManager = logManager;
  }

  create (webhook): IWebhookListener {
    let webhookListener;
    switch (webhook.query.queryType) {
      case 'EventQuery':
        webhookListener = new WebhookListener(fetch, this.web3, this.logManager);
        break
      case 'GraphQuery':
        webhookListener = new SubscriptionListener(fetch, this.logManager);
        break
      default:
        throw new Error(`Unknown queryType ${webhook.query.queryType}`);
    }
    return webhookListener;
  }
}
