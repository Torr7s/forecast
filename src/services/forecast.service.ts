import _ from 'lodash';

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
    try {
      const beachForecasts: BeachForecast[] = await this.calculateRating(beaches);
      const forecastsByTime: TimeForecast[] = this.mapForecastsByTime(beachForecasts);

      const orderedForecastsByRating: TimeForecast[] = forecastsByTime.map(
        ({
          forecast,
          time
        }: TimeForecast) => (
          {
            time,
            forecast: _.orderBy(forecast, ['rating'], ['desc'])
          })
      );

      return orderedForecastsByRating;
    } catch (error) {
      logger.error(error);

      throw new ForecastProcessingInternalError((error as Error).message);
    }
  }

  private async calculateRating(beaches: Beach[]): Promise<BeachForecast[]> {
    const forecastPointsWithCorrectSources: BeachForecast[] = [];

    for (const beach of beaches) {
      const rating = new this.ratingService(beach);

      const forecastPoints: NormalizedForecastPoint[] = await this.stormGlass.fetchPointWeatherData(beach.lat, beach.lng);
      const enrichedBeachData: BeachForecast[] = this.enrichBeachData(beach, forecastPoints, rating);

      forecastPointsWithCorrectSources.push(...enrichedBeachData);
    }

    return forecastPointsWithCorrectSources;
  }

  private enrichBeachData(beach: Beach, forecastPoints: NormalizedForecastPoint[], rating: RatingService): BeachForecast[] {
    const enrichedBeachData: BeachForecast[] = forecastPoints
      .map((point: NormalizedForecastPoint): BeachForecast => ({
        ...{
          name: beach.name,
          lat: beach.lat,
          lng: beach.lng,
          position: beach.position,
          rating: rating.getPointRate(point)
        },
        ...point
      }));

    return enrichedBeachData;
  }

  private mapForecastsByTime(forecasts: BeachForecast[]): TimeForecast[] {
    const forecastsByTime: TimeForecast[] = [];

    for (const forecast of forecasts) {
      const singleForecastByTime: TimeForecast = forecastsByTime.find((f: TimeForecast): boolean => f.time === forecast.time);

      singleForecastByTime ? singleForecastByTime.forecast.push(forecast) : forecastsByTime.push({ time: forecast.time, forecast: [forecast] });
    }

    return forecastsByTime;
  }
}