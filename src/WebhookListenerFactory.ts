import { WebhookListener } from './types'
import fetch from 'node-fetch'

export class WebhookListenerFactory {
  private final web3: any;

  constructor(web3: any) {
    this.web3 = web3
  }

  create (webhook): WebhookListener {
    let webhookListener = new WebhookListener(fetch, this.web3)
    webhookListener.start(webhook)
    return webhookListener
  }
}
