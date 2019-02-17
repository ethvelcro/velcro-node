export const getMainDefinition = jest.fn((query) => ({
  kind: 'OperationDefinition',
  operation: 'subscription'
}))
