# [DEPRECATED]

This repo was created for the ETHDenver 2019 Hackathon.  We're keeping this available for historical purposes.

The project has been rebranded as Notus.  You can refer to the new Notus node [Github project](https://github.com/NotifyUs/notus-node).

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
