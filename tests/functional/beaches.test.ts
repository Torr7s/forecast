import { BeachPosition } from '@src/typings';

describe('Beaches functional tests', (): void => {
  describe('When creating a beach', (): void => {
    it('should create a beach successfully', async (): Promise<void> => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E
      }

      const response = await global.testRequest.post('/api/beaches').send(newBeach);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });
  });
});