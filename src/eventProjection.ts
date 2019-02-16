export function eventProjection(events: any[]): Set<string> {
  const result = new Set<string>()

  events.forEach(event => {
    switch(event.event) {
      case 'Registered':
        result.add(event.args.ipfsHash)
        break
      case 'Unregistered':
        result.delete(event.args.ipfsHash)
        break
      // no default
    }
  })

  return result
}
