import supertest from 'supertest';

describe('Beach forecast functional tests', (): void => {
  it('should return a forecast with just a few times', async (): Promise<void> => {
    /* app still to be built */
    const { body, status } = await supertest(app).get('api/forecast');

    expect(body).toBe({
      status: 'ok',
      message: 'Forecast controller test'
    });
  });
});