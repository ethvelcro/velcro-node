import { validator } from '../validator'

describe('validator', () => {
  it('should validate correctly', async () => {
    const validate = await validator()

    expect(validate({
      url: 'I am a url',
      query: {
        queryType: 'EventQuery',
        address: '0x1234',
        topics: []
      },
      paramMapping: []
    })).toBeTruthy()

    expect(
      validate({
        url: 'test'
      })
    ).toBeFalsy()
  })
})
