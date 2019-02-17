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

## required env vars
See `./env.example` for local dev defaultss

```
PORT               | Port server will bind to for http and websocket traffic
CONTRACT_ADDRESS   | Address for the the contract to monitor for 
WS_URL             | Ethereum event subscription url via websocket
```

## deploy

### docker
https://hub.docker.com/r/ethvelcro/velcro-node

``` bash
docker pull ethvelcro/velcro-node:latest
```

### kubernetes
You can find an example deploy configuration that is used for the public server in `./k8s`.
