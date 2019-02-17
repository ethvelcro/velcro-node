export const observable = {
  subscribe: jest.fn(),
  unsubscribe: jest.fn()
}
export const stop = jest.fn()
export const apolloClient = {
  subscribe: jest.fn(() => observable),
  stop: jest.fn(() => stop)
}
export const apolloClientFactory = jest.fn((uri) => apolloClient)
