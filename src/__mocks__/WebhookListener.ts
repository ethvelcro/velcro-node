export const mockStart = jest.fn();
export const mockStop = jest.fn();

export const WebhookListener = jest.fn().mockImplementation(() => {
  return {
    start: mockStart,
    stop: mockStop
  };
});
