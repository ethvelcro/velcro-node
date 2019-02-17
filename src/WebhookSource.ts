import { Webhook } from './types';
import { WebhookListener } from './WebhookListener';
import { validator } from './validator';

export class WebhookSource {
  private _ipfs: any;

  constructor (ipfs: any) {
    this._ipfs = ipfs;
  }

  async get (ipfsHash): Promise<Webhook> {
    const [{ path, content }] = await this._ipfs.get(ipfsHash);
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
