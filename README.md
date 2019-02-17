# velcro-node

The Velcro node is a server that listens for Ethereum smart contract events or Graph Protocol subscriptions and triggers their corresponding webhooks.

Webhooks can be defined and registered by anyone in a [Velcro smart contract](https://github.com/ethvelcro/velcro-contracts).  The Velcro node must be configured to point to the deployed smart contract.  When webhooks are deregistered from the smart contract the server stops listening to those events.

## dependencies
- node >= 10
- yarn

## setup
```bash
yarn
```

## run
```bash
yarn dev
```
