import { WebhookListener } from './WebhookListener';
import { LogManager } from './LogManager';
import fetch from 'node-fetch';

export class WebhookListenerFactory {
  private web3: any;
  private logManager: LogManager;

  constructor(web3: any, logManager: LogManager) {
    this.web3 = web3;
    this.logManager = logManager;
  }

  create (webhook): WebhookListener {
    let webhookListener = new WebhookListener(fetch, this.web3, this.logManager);
    webhookListener.start(webhook);
    return webhookListener;
  }
}
