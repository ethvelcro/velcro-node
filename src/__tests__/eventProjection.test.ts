import { eventProjection } from '../eventProjection'

function Registered(ipfsHash: string): any {
  return {
    event: 'Registered',
    args: {
      ipfsHash
    }
  }
}

function Unregistered(ipfsHash: string): any {
  return {
    event: 'Unregistered',
    args: {
      ipfsHash
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
