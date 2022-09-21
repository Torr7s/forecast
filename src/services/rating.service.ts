import { Beach, BeachPosition } from '@src/shared/infra/mongo/models/beach.model';

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

  public getRatingBasedOnWindAndWavePositions(wavePosition: BeachPosition, windPosition: BeachPosition): number {
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

  private isWindOffShore(wavePosition: BeachPosition, windPosition: BeachPosition): boolean {
    return (
      (wavePosition === BeachPosition.N &&
        windPosition === BeachPosition.S &&
        this.beach.position === BeachPosition.N) ||
      (wavePosition === BeachPosition.S &&
        windPosition === BeachPosition.N &&
        this.beach.position === BeachPosition.S) ||
      (wavePosition === BeachPosition.E &&
        windPosition === BeachPosition.W &&
        this.beach.position === BeachPosition.E) ||
      (wavePosition === BeachPosition.W &&
        windPosition === BeachPosition.E &&
        this.beach.position === BeachPosition.W)
    );
  }
}