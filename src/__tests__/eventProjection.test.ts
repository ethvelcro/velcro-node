import { eventProjection } from '../eventProjection'
import * as utils from 'web3-utils'

function Registered(ipfsHash: string): any {
  return {
    event: 'Registered',
    returnValues: {
      ipfsHash: utils.utf8ToHex(ipfsHash)
    }
  }
}

function Unregistered(ipfsHash: string): any {
  return {
    event: 'Unregistered',
    returnValues: {
      ipfsHash: utils.utf8ToHex(ipfsHash)
    }
  }
}

describe('eventProjection', () => {
  it('should create a list of active hashes', () => {
    const logs = [
      Registered('1234'),
      Registered('asdf'),
      Unregistered('1234')
    ]
    const set = eventProjection(logs)

    expect(set).toEqual(new Set(['asdf']))
  })
})
