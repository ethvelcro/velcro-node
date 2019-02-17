import Web3 from 'web3';
import ipfsClient from 'ipfs-http-client';

import { WebhookSource } from './WebhookSource';
import { WebhookListenerFactory } from './WebhookListenerFactory';
import { WebhookManager } from './WebhookManager';
import { LogManager } from './LogManager';

export async function setup(
  velcroContractAddress: string,
  providerUrl: string,
  ipfsUrl: string,
  logManager: LogManager
) {

  const web3 = new Web3(new Web3.providers.WebsocketProvider(providerUrl));
  const ipfs = ipfsClient('ipfs.infura.io', '5001', { protocol: 'https'});

  const webhookSource = new WebhookSource(ipfs);
  const webhookListenerFactory = new WebhookListenerFactory(web3, logManager);
  const webhookManager = new WebhookManager(
    web3,
    velcroContractAddress,
    webhookSource,
    webhookListenerFactory
  );
  console.log('Starting manager...')
  await webhookManager.start();
  console.log('Manager started')
}
