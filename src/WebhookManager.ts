import { eventProjection } from './eventProjection';
import { WebhookSource } from './WebhookSource';
import { WebhookListener } from './WebhookListener'
import { WebhookListenerFactory } from './WebhookListenerFactory';
import * as utils from 'web3-utils';

export class WebhookManager {
  private web3: any;
  private listeners: Map<string, WebhookListener>;
  private webhookSource: WebhookSource;
  private webhookListenerFactory;
  private subscription: any;
  private address: string;

  constructor (
    web3: any,
    address: string,
    webhookSource: WebhookSource,
    webhookListenerFactory: WebhookListenerFactory
  ) {
    this.web3 = web3;
    this.address = address;
    this.webhookSource = webhookSource;
    this.webhookListenerFactory = webhookListenerFactory
    this.listeners = new Map()
  }

  async start() {
    if (this.subscription) { return }

    const topics = [
      [
        utils.sha3('Registered(address,bytes)'),
        utils.sha3('Unregistered(address,bytes)')
      ]
    ];

    var subscription =
      this.web3.eth.subscribe(
        'logs',
        this.address,
        topics
      );

    subscription.on('data', this.onData.bind(this));
    subscription.on('error', this.onError.bind(this));

    this.subscription = subscription;

    const events = await this.web3.eth.getPastLogs({
      fromBlock: 0,
      toBlock: 'latest',
      address: this.address,
      topics
    });

    const ipfsHashes = eventProjection(events);

    await Promise.all(Array.from(ipfsHashes).map(ipfsHash => this.register(ipfsHash)));
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  onData(log) {
    switch (log.event) {
      case 'Registered':
        this.onRegistered(log);
        break;
      case 'Unregistered':
        this.onUnregistered(log);
        break;
      // no default
    }
  }

  onError(error) {
    console.error(error);
  }

  onRegistered(log) {
    const { ipfsHash } = log.args;
    this.register(ipfsHash);
  }

  async register(ipfsHash) {
    await this.webhookSource.get(ipfsHash)
      .then(webhook => {
        this.listeners[ipfsHash] = this.webhookListenerFactory.create(webhook)
      })
      .catch(error => {
        console.error(error)
      });
  }

  onUnregistered(log) {
    const { ipfsHash } = log.args;
    let webhookListener = this.listeners[ipfsHash]
    if (webhookListener) {
      webhookListener.stop()
      delete this.listeners[ipfsHash]
    }
  }
}
