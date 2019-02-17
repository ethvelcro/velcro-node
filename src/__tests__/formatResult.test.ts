import { formatResult } from '../formatResult'
import { webhookFactory } from './support/webhookFactory'

describe('formatResult', () => {
  it('should build a standard query without remapping', () => {
    const webhook = webhookFactory()
    const response = { result: 'foo' }
    expect(formatResult(webhook, response)).toEqual({
      webhook,
      result: response
    })
  })

  it('should correctly render the param mappings', () => {
    const webhook = webhookFactory([
      {
        paramName: 'param1',
        resultPath: 'foo.bar'
      },
      {
        paramName: 'param2',
        resultPath: 'juice.truck'
      }
    ])
    const response = {
      foo: {
        bar: 'test'
      },
      juice: {
        truck: 'orange'
      }
    }

    expect(formatResult(webhook, response)).toEqual({
      webhook,
      result: {
        param1: 'test',
        param2: 'orange'
      }
    })
  })
})
