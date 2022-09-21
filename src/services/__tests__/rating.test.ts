import { RatingService } from '../rating.service';

import { Beach, BeachPosition } from '@src/shared/infra/mongo/models/beach.model';

describe('Rating Service', (): void => {
  const defaultBeach: Beach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Manly',
    position: BeachPosition.E,
    user: 'fake-user-id'
  }

  const defaultRating = new RatingService(defaultBeach);

  describe('Calculate rating for a given point', (): void => {
    // todo 
  });

  /**
   * Wave and wind rating calculating
   */
  describe('Get rating based on WIND and WAVE POSITIONS', (): void => {
    it('should get rating 1 for a beach with onshore winds', (): void => {
      const rating: number = defaultRating.getRatingBasedOnWindAndWavePositions(BeachPosition.E, BeachPosition.E);

      expect(rating).toBe(1);
    });

    it('should get rating 3 for a beach with cross winds', (): void => {
      const rating: number = defaultRating.getRatingBasedOnWindAndWavePositions(BeachPosition.E, BeachPosition.S);

      expect(rating).toBe(3);
    });

    it('should get rating 5 for a beach with offshore winds', (): void => {
      const rating: number = defaultRating.getRatingBasedOnWindAndWavePositions(BeachPosition.E, BeachPosition.W);

      expect(rating).toBe(5);
    });
  });

  /**
   * Period rating calculating
   */
  describe('Get rating based on SWELL PERIOD', (): void => {
    it('should get a rating of 1 for a period of 5 seconds', (): void => {
      const rating: number = defaultRating.getRatingForSwellPeriod(5);

      expect(rating).toBe(1);
    });

    it('should get a rating of 2 for a period of 9 seconds', (): void => {
      const rating: number = defaultRating.getRatingForSwellPeriod(9);

      expect(rating).toBe(2);
    });

    it('should get a rating of 4 for a period of 12 seconds', (): void => {
      const rating: number = defaultRating.getRatingForSwellPeriod(12);

      expect(rating).toBe(4);
    });

    it('should get a rating of 5 for a period of 14 seconds', (): void => {
      const rating: number = defaultRating.getRatingForSwellPeriod(16);

      expect(rating).toBe(5);
    });
  });

  /**
   * Swell height specific logic calculation
   */
  describe('Get rating based on SWELL HEIGHT', (): void => {
    it('should get rating 1 for less than ankle to knee high swell', (): void => {
      const rating: number = defaultRating.getRatingForSwellSize(0.2);

      expect(rating).toBe(1);
    });

    it('should get rating 2 for an ankle to knee swell', (): void => {
      const rating: number = defaultRating.getRatingForSwellSize(0.6);

      expect(rating).toBe(2);
    });

    it('should get rating 3 for waist high swell', (): void => {
      const rating: number = defaultRating.getRatingForSwellSize(1.5);

      expect(rating).toBe(3);
    });

    it('should get rating 5 for overhead swell', (): void => {
      const rating: number = defaultRating.getRatingForSwellSize(2.5);

      expect(rating).toBe(5);
    });
  });

  /**
   * Location specific calculation
   */
  describe('Get position based on POINTS LOCATION', (): void => {
    it('should get the point based on a east location', (): void => {
      const response: BeachPosition = defaultRating.getPositionFromLocation(92);

      expect(response).toBe(BeachPosition.E);
    });

    it('should get the point based on a north location 1', (): void => {
      const response: BeachPosition = defaultRating.getPositionFromLocation(360);

      expect(response).toBe(BeachPosition.N);
    });

    it('should get the point based on a north location 2', (): void => {
      const response: BeachPosition = defaultRating.getPositionFromLocation(40);

      expect(response).toBe(BeachPosition.N);
    });

    it('should get the point based on a south location', (): void => {
      const response: BeachPosition = defaultRating.getPositionFromLocation(200);

      expect(response).toBe(BeachPosition.S);
    });

    it('should get the point based on a west location', (): void => {
      const response: BeachPosition = defaultRating.getPositionFromLocation(300);

      expect(response).toBe(BeachPosition.W);
    });
  });
});