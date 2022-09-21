import { RatingService } from './rating.service';

import { StormGlassClient } from '@src/clients/stormGlass.client';

import { ForecastProcessingInternalError } from '@src/shared/utils/errors/forecast/processing.error';

import { Beach } from '@src/shared/infra/mongo/models/beach.model';

import {
  BeachForecast,
  NormalizedForecastPoint,
  TimeForecast
} from '@src/typings';

import logger from '@src/logger';

export class ForecastService {
  constructor(
    protected stormGlass: StormGlassClient = new StormGlassClient(),
    protected ratingService: typeof RatingService = RatingService
  ) {};

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    
    logger.info(`Preparing the forecast for ${beaches.length} beaches`);

    try {

      for (const beach of beaches) {
        const rating = new this.ratingService(beach);

        const points: NormalizedForecastPoint[] = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData: BeachForecast[] = this.enrichBeachData(beach, points, rating);

        pointsWithCorrectSources.push(...enrichedBeachData);
      }

      const mappedForecast: TimeForecast[] = this.mapForecastByTime(pointsWithCorrectSources);

      return mappedForecast;
    } catch (error) {
      logger.error(error);

      throw new ForecastProcessingInternalError((error as Error).message);
    }
  }

  private enrichBeachData(beach: Beach, points: NormalizedForecastPoint[], rating: RatingService): BeachForecast[] {
    const enrichedBeachData: BeachForecast[] = points
      .map((point: NormalizedForecastPoint): BeachForecast => ({
        ...{
          name: beach.name,
          lat: beach.lat,
          lng: beach.lng,
          position: beach.position,
          rating: rating.getRateForPoint(point)
        },
        ...point
      }));

    return enrichedBeachData;
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];

    for (const point of forecast) {
      const timePoint: TimeForecast = forecastByTime.find((f: TimeForecast): boolean => f.time === point.time);

      timePoint ? timePoint.forecast.push(point) : forecastByTime.push({ time: point.time, forecast: [point] });
    }

    return forecastByTime;
  }
}