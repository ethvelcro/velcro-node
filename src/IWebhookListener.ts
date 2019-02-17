import { Webhook } from './types'

export interface IWebhookListener {
  start(webhook: Webhook);
  stop();
}
