import { eventProjection } from './eventProjection'
import { WebhookSource } from './WebhookSource'
import fetch from 'node-fetch'

class WebhookManager {
  private final web3: any
  private final listeners: Map<string, WebhookListener>
  private final webhookSource: WebhookSource

  constructor (
    web3: any,
    address: string,
    webhookSource: WebhookSource
  ) {
    this.web3 = web3
    this.address = address
    this.webhookSource = webhookSource
    this.listeners = {}
  }

  public function start() {
    if (this.subscription) { return }

    const topics = [
      [
        `0x${web3.utils.sha3('Registered(address,bytes)')}`,
        `0x${web3.utils.sha3('Unregistered(address,bytes)')}`
      ]
    ]

    var subscription =
      this.web3.eth.subscribe(
        'logs',
        this.address,
        topics
      )

    subscription.on('data', this.onData.bind(this))
    subscription.on('error', this.onError.bind(this))

    this.subscription = subscription

    const events = await this.web3.eth.getPastLogs({
      fromBlock: 0,
      toBlock: 'latest',
      address: this.address,
      topics
    })

    const ipfsHashes = eventProjection(events)

    ipfsHashes.forEach(ipfsHash => this.register(ipfsHash))
  }

  public function stop() {
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
  }

  public function onData(log) {
    switch (log.event) {
      case 'Registered':
        this.onRegistered(log)
        break
      case 'Unregistered':
        this.onUnregistered(log)
        break
      // no default
    }
  }

  public function onError(error) {
    console.error(error)
  }

  public function onRegistered(log) {
    const { ipfsHash } = log.args
    this.register(ipfsHash)
  }

  public function register(ipfsHash) {
    this.webhookSource.get(ipfsHash)
      .then(webhook => {
        listeners[ipfsHash] = new WebhookListener(fetch, this.web3)
        webhookListener.start(webhook)
      })
      .catch(error => {
        console.error(error)
      })
  }

  public function onUnregistered() {
    let webhookListener = listeners[ipfsHash]
    if (webhookListener) {
      webhookListener.stop()
      delete listeners[ipfsHash]
    }
  }
}
