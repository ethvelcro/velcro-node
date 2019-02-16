import { Webhook } from './types'
import { WebhookListener } from './WebhookListener'
import { validator } from './validator'

export class WebhookSource {
  private ipfs: any;

  constructor (ipfs: any) {
    this.ipfs = ipfs;
  }

  async get (ipfsHash): Promise<Webhook> {
    const content = await this.ipfs.get(ipfsHash);
    const json = JSON.parse(content);
    const validate = validator();
    if (!validate(json)) {
      throw new Error(
        validate.errors.map(err => err.message).join(', ')
      );
    }
    return json;
  }
}
