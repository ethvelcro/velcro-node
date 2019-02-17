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
        console.log(`Creating EventQuery webhook with ${webhook.ipfsHash}`)
        webhookListener = new WebhookListener(fetch, this.web3, this.logManager);
        break
      case 'GraphQuery':
        console.log(`Creating GraphQuery webhook with ${webhook.ipfsHash}`)
        webhookListener = new SubscriptionListener(fetch, this.logManager);
        break
      default:
        throw new Error(`Unknown queryType ${webhook.query.queryType}`);
    }
    webhookListener.start(webhook)
    return webhookListener;
  }
}
