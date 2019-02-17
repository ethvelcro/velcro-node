jest.mock('../getMainDefinition')
jest.mock('../apolloClientFactory')

import { SubscriptionListener } from '../SubscriptionListener'
import { LogManager } from '../LogManager'
import { graphWebhookFactory } from './support/graphWebhookFactory'

// jest.mock('../getMainDefinition', () => {
//   return {
//     getMainDefinition: jest.fn(() => ({
//       kind: 'OperationDefinition',
//       operation: 'subscription'
//     }))
//   }
// })
//
// jest.mock('../apolloClientFactory', () => {
//   let apolloClient = {
//     subscribe: jest.fn(),
//     stop: jest.fn()
//   }
//   return {
//     apolloClient,
//     apolloClientFactory: () => apolloClient
//   }
// });

describe('SubscriptionListener', () => {
  const { subscribe, apolloClient, observable } = require('../apolloClientFactory')

  let fetch, subscriptionListener, client

  beforeEach(() => {
    fetch = jest.fn()
    let logManager = new LogManager()
    subscriptionListener = new SubscriptionListener(fetch, logManager)
  })

  describe('start()', () => {
    it('should work', () => {
      const webhook = graphWebhookFactory()

      subscriptionListener.start(webhook)

      expect(apolloClient.subscribe).toHaveBeenCalledTimes(1)
      expect(observable.subscribe).toHaveBeenCalledTimes(1)
    })
  })
})
