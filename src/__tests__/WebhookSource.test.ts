import { WebhookSource } from '../WebhookSource'

describe('WebhookSource', () => {
  const validWebhook = {
    url: 'webhookUrl',
    query: {
      address: 'addy',
      topics: ['1']
    }
  }

  const invalidWebhook = {
    foo: 'bar'
  }

  it('should retrieve from IPFS and validate and contruct', async () => {
    let ipfs = {
      get: jest.fn(() => JSON.stringify(validWebhook))
    }
    let webhookSource = new WebhookSource(ipfs)
    var webhook = await webhookSource.get('ipfsHash')
    expect(webhook.url).toEqual('webhookUrl')
    expect(ipfs.get).toHaveBeenCalledWith('ipfsHash')
  })

  it('should throw on an invalid webhook', async () => {
    let ipfs = {
      get: jest.fn(() => JSON.stringify(invalidWebhook))
    }
    let webhookSource = new WebhookSource(ipfs)

    let errorThrown = false
    try {
      await webhookSource.get('ipfsHash')
    } catch (error) {
      errorThrown = true
    }

    expect(errorThrown).toBeTruthy()
  })
})
