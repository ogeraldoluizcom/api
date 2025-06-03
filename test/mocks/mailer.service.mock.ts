export const mailerServiceMock = {
  sendMail: jest.fn().mockResolvedValue({
    messageId: 'mocked-id',
  }),
};
