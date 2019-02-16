import { WebhookListener } from "../WebhookListener";
import { webhookFactory } from "./support/webhookFactory";

describe("WebhookListener", () => {
  let subscription, fetch, web3, webhookListener;

  beforeEach(() => {
    subscription = {
      on: jest.fn(),
      unsubscribe: jest.fn()
    };
    fetch = jest.fn();
    web3 = {
      eth: {
        subscribe: () => subscription,
      },
    };
    webhookListener = new WebhookListener(fetch, web3);
  });

  describe("start()", () => {
    it("should attach all of the listeners", () => {
      const webhook = webhookFactory();
      webhookListener.start(webhook);
      expect(subscription.on).toHaveBeenCalledWith("data", expect.anything());
      expect(subscription.on).toHaveBeenCalledWith("changed", expect.anything());
      expect(subscription.on).toHaveBeenCalledWith("error", expect.anything());
    });

    it("should not start again if already started", () => {
      webhookListener.start(webhookFactory());
      expect(() => {
        webhookListener.start(webhookFactory());
      }).toThrow();
    });
  });

  describe("stop()", () => {
    it('should stop a started subscription', () => {
      webhookListener.stop();
      webhookListener.start(webhookFactory());
      webhookListener.stop();
      expect(subscription.unsubscribe).toHaveBeenCalledTimes(1)
    })
  });

  describe('onData', () => {
    it('should call fetch', () => {
      const webhook = webhookFactory()
      webhookListener.onData(webhook, { hello: 'test' })
      expect(fetch).toHaveBeenCalledWith(webhook.url, {
        method: 'POST',
        body: JSON.stringify({
          webhook,
          result: { hello: 'test' }
        })
      })
    })
  })

  describe('onChanged', () => {
    it('should call fetch', () => {
      const webhook = webhookFactory()
      webhookListener.onChanged(webhook, { hello: 'test' })
      expect(fetch).toHaveBeenCalledWith(webhook.url, {
        method: 'POST',
        body: JSON.stringify({
          webhook,
          result: { hello: 'test' }
        })
      })
    })
  })
});
