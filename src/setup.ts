import Web3 from 'web3';
import ipfsClient from 'ipfs-http-client';

import { WebhookSource } from './WebhookSource';
import { WebhookListenerFactory } from './WebhookListenerFactory';
import { WebhookManager } from './WebhookManager';

export async function setup(
  velcroContractAddress: string,
  providerUrl: string,
  ipfsUrl: string
) {

  const web3 = new Web3(new Web3.providers.WebsocketProvider(providerUrl));
  const ipfs = ipfsClient(ipfsUrl);

  const webhookSource = new WebhookSource(ipfs);
  const webhookListenerFactory = new WebhookListenerFactory(web3);
  const webhookManager = new WebhookManager(
    web3,
    velcroContractAddress,
    webhookSource,
    webhookListenerFactory
  );
  await webhookManager.start();
}
