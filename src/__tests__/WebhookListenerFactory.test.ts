import { WebhookListenerFactory } from '../WebhookListenerFactory'
import { LogManager } from '../LogManager'
import { webhookFactory } from './support/webhookFactory'
import { graphWebhookFactory } from './support/graphWebhookFactory'

jest.mock('../WebhookListener')
jest.mock('../SubscriptionListener')

describe('WebhookListenerFactory', () => {
  let webhookListenerFactory,
      web3,
      logManager

  beforeEach(() => {
    web3 = 'asdf'
    logManager = new LogManager()
    webhookListenerFactory = new WebhookListenerFactory(web3, logManager)
  })

  it('should build an EventQuery', () => {
    webhookListenerFactory.create(webhookFactory())
  })

  it('should build a GraphQuery', () => {
    webhookListenerFactory.create(graphWebhookFactory())
  })
})
