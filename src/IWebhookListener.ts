import { Webhook } from './types'

export interface IWebhookListener {
  public start(webhook: Webhook);
  public stop();
}
