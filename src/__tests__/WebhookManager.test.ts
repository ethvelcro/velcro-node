import { WebhookManager } from '../WebhookManager'
import { WebhookSource } from '../WebhookSource'
import * as utils from 'web3-utils'

jest.mock('../eventProjection')

describe('WebhookManager', () => {
  let web3,
      subscribe,
      subscription,
      get,
      manager,
      getPastLogs,
      webhookListenerFactory

  beforeEach(() => {
    subscription = {
      on: jest.fn()
    }
    getPastLogs = jest.fn(() => [])
    subscribe = jest.fn(() => subscription)
    get = jest.fn(() => Promise.resolve('webhook'))
    web3 = {
      utils: {
        sha3: utils.sha3
      },
      eth: {
        subscribe,
        getPastLogs
      }
    }
    let webhookSource = new WebhookSource('ipfs')
    webhookSource.get = get
    webhookListenerFactory = {
      create: jest.fn(() => 'webhookListener')
    }
    manager = new WebhookManager(
      web3, '0x1234', webhookSource, webhookListenerFactory
    )
  })

  describe('start()', () => {
    it(
      'should setup the subscription and pull events',
      async () => {
        const topics = [
          [
            utils.sha3('Registered(address,bytes)'),
            utils.sha3('Unregistered(address,bytes)')
          ]
        ]

        await manager.start()
        expect(subscribe).toHaveBeenCalledWith(
          'logs',
          '0x1234',
          topics
        )

        expect(subscription.on).toHaveBeenCalledWith(
          'data', expect.anything()
        )

        expect(subscription.on).toHaveBeenCalledWith(
          'error', expect.anything()
        )

        expect(getPastLogs).toHaveBeenCalledWith({
          fromBlock: 0,
          toBlock: 'latest',
          address: '0x1234',
          topics
        })

        expect(get).toHaveBeenCalledWith('asdf')

        expect(webhookListenerFactory.create).toHaveBeenCalledWith('webhook')
      }
    )
  })
})
