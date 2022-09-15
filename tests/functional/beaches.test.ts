import { Beach } from '@src/shared/database/models/beach.model';

import { BeachPosition } from '@src/typings';

describe('Beaches functional tests', (): void => {
  beforeAll(async (): Promise<any> => await Beach.deleteMany());

  describe('When creating a beach', (): void => {
    it('should create a beach successfully', async (): Promise<void> => {
      const newBeach = {
        name: 'Manly',
        position: BeachPosition.E,
        lat: -33.792726,
        lng: 151.289824
      }

      const response = await global.testRequest.post('/api/beaches').send(newBeach);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('should return 422 when there is a validation error', async (): Promise<void> => {
      const newBeach = {
        name: 'Manly',
        position: BeachPosition.E,
        lat: 'invalid_string',
        lng: 151.289824
      }

      const response = await global.testRequest.post('/api/beaches').send(newBeach);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error:
          'beaches validation failed: lat: Cast to Number failed for value \"invalid_string"\ (type string) at path "lat"'
      });
    });
  });
});