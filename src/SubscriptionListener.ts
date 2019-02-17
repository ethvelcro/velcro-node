import { IWebhookListener } from './IWebhookListener';
import { Webhook, GraphQuery } from './types';
import { apolloClientFactory } from './apolloClientFactory';
import gql from 'graphql-tag';
import { LogManager } from './LogManager';
import { getMainDefinition } from './getMainDefinition';
import { formatResult } from './formatResult';

export class SubscriptionListener implements IWebhookListener {
  private fetch: Function;
  private logManager: LogManager;
  private client: any;
  private queryObservable: any;

  constructor (fetch: Function, logManager: LogManager) {
    this.fetch = fetch;
    this.logManager = logManager;
  }

  public start(webhook: Webhook) {
    try {
      const graphQuery = <GraphQuery> webhook.query
      this.client = apolloClientFactory(graphQuery.websocketUri)
      let query = gql(graphQuery.subscriptionQuery)
      const { kind, operation } = getMainDefinition(query);
      const isSubscription = kind === 'OperationDefinition' && operation === 'subscription';
      if (!isSubscription) {
        throw new Error(`Configured query is not a graphql subscription`)
      }
      this.queryObservable = this.client.subscribe({
        fetchPolicy: 'network-only',
        query,
        variables: {
          time: ((new Date()).getTime() / 1000)
        }
      })

      this.queryObservable.subscribe({
        next: this.onNext.bind(this, webhook),
        error: this.onError.bind(this, webhook)
      })
    } catch (error) {
      this.onError(webhook, error)
    }
  }

  onNext(webhook, data) {
    let result = formatResult(webhook, data);
    this.fetch(webhook.url, {
      method: "POST",
      body: JSON.stringify(result),
    }).catch(error => {
      this.onError(webhook, error)
    });
  }

  onError(webhook, error) {
    console.error(error)
    this.logManager.pushLog(webhook.ipfsHash, {
      type: 'error',
      message: error.message
    })
  }

  public stop() {
    if (this.queryObservable) {
      this.queryObservable.unsubscribe();
      delete this.queryObservable;
      this.queryObservable = null;
    }
    if (this.client) {
      this.client.stop();
      delete this.client;
      this.client = null;
    }
  }
}
