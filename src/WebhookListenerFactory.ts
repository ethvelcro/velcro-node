import { WebhookListener } from './WebhookListener';
import fetch from 'node-fetch';

export class WebhookListenerFactory {
  private web3: any;

  constructor(web3: any) {
    this.web3 = web3;
  }

  create (webhook): WebhookListener {
    let webhookListener = new WebhookListener(fetch, this.web3);
    webhookListener.start(webhook);
    return webhookListener;
  }
}
