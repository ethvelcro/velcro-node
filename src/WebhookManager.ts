import { eventProjection } from './eventProjection';
import { WebhookSource } from './WebhookSource';
import { WebhookListener } from './WebhookListener'
import { WebhookListenerFactory } from './WebhookListenerFactory';
import velcroArtifact from 'velcro-contracts/build/contracts/Velcro.json'
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

    var contract = this.getContract()

    var subscription = contract.events.allEvents()

    subscription.on('data', this.onData.bind(this));
    subscription.on('error', this.onError.bind(this));

    this.subscription = subscription;

    const events = await contract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest'
    });

    console.log(`Found ${events.length} past events`)

    const ipfsHashes = eventProjection(events);

    console.log('Found hashes', ipfsHashes)

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
    const ipfsHash = utils.toUtf8(log.returnValues.ipfsHash);
    this.register(ipfsHash);
  }

  async register(ipfsHash) {
    await this.webhookSource.get(ipfsHash)
      .then(webhook => {
        console.log(`Starting webhook ${ipfsHash}...`)
        this.listeners[ipfsHash] = this.webhookListenerFactory.create(webhook)
      })
      .catch(error => {
        console.log(`Error starting webhook ${ipfsHash}: ${error.message}`)
        console.error(error)
      });
  }

  onUnregistered(log) {
    const ipfsHash = utils.toUtf8(log.returnValues.ipfsHash);
    let webhookListener = this.listeners[ipfsHash]
    if (webhookListener) {
      console.log(`Stopping webhook ${ipfsHash}...`)
      webhookListener.stop()
      delete this.listeners[ipfsHash]
    }
  }

  getContract () {
    return new this.web3.eth.Contract(velcroArtifact.abi, this.address)
  }
}
