import * as utils from 'web3-utils'

export function eventProjection(events: any[]): Set<string> {
  const result = new Set<string>()

  events.forEach(event => {
    switch(event.event) {
      case 'Registered':
        result.add(utils.toUtf8(event.returnValues.ipfsHash))
        break
      case 'Unregistered':
        result.delete(utils.toUtf8(event.returnValues.ipfsHash))
        break
      // no default
    }
  })

  return result
}
