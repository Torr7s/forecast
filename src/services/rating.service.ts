import { Beach, GeoPosition } from '@src/shared/infra/mongo/models/beach.model';

import { NormalizedForecastPoint } from '@src/typings';

// In meters
const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0
  },
  waistHigh: {
    min: 1.0,
    max: 2.0
  },
  headHigh: {
    min: 2.0,
    max: 2.5
  }
}

export class RatingService {
  constructor(private beach: Beach) {};

  public getRateForPoint(point: NormalizedForecastPoint) {
    const swellDirection: GeoPosition = this.getPositionFromLocation(point.swellDirection);
    const windDirection: GeoPosition = this.getPositionFromLocation(point.windDirection);

    const windAndWaveRating: number = this.getRatingBasedOnWindAndWavePositions(
      swellDirection,
      windDirection
    );

    const swellHeightRating: number = this.getRatingForSwellSize(point.swellHeight);
    const swellPeriodRating: number = this.getRatingForSwellPeriod(point.swellPeriod);

    const finalRating: number = (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;

    return Math.round(finalRating);
  }

  public getRatingBasedOnWindAndWavePositions(wavePosition: GeoPosition, windPosition: GeoPosition): number {
    if (wavePosition === windPosition) 
      return 1;
    else if (
      this.isWindOffShore(
        wavePosition,
        windPosition
      )
    ) return 5;

    return 3;
  }

  /**
   * Rate will start from 1 given there will be always some wave period
   */
  public getRatingForSwellPeriod(period: number): number {
    const ratings: number[] = [1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 4, 4, 4, 4, 5];

    return ratings[period >= 14 ? 14 : period];
  }

  /**
   * Rate will start from 1 given there will always some wave height
   */
  public getRatingForSwellSize(height: number): number {
    if (height < waveHeights.ankleToKnee.min) return 1;
    if (height < waveHeights.ankleToKnee.max) return 2;
    if (height < waveHeights.waistHigh.max) return 3;

    return 5;
  }

  public getPositionFromLocation(coordinates: number): GeoPosition {
    if (coordinates < 50) return GeoPosition.N;
    if (coordinates < 120) return GeoPosition.E;
    if (coordinates < 220) return GeoPosition.S;
    if (coordinates < 310) return GeoPosition.W;

    return GeoPosition.N;
  }

  private isWindOffShore(wavePosition: GeoPosition, windPosition: GeoPosition): boolean {
    return (
      (wavePosition === GeoPosition.N &&
        windPosition === GeoPosition.S &&
        this.beach.position === GeoPosition.N) ||
      (wavePosition === GeoPosition.S &&
        windPosition === GeoPosition.N &&
        this.beach.position === GeoPosition.S) ||
      (wavePosition === GeoPosition.E &&
        windPosition === GeoPosition.W &&
        this.beach.position === GeoPosition.E) ||
      (wavePosition === GeoPosition.W &&
        windPosition === GeoPosition.E &&
        this.beach.position === GeoPosition.W)
    );
  }
}