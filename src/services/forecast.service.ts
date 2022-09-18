import { StormGlassClient } from '@src/clients/stormGlass.client';

import { ForecastProcessingInternalError } from '@src/shared/utils/errors/forecast/processing.error';

import { Beach } from '@src/shared/database/models/beach.model';

import {
  BeachForecast,
  NormalizedForecastPoint,
  TimeForecast
} from '@src/typings';

export class ForecastService {
  constructor(protected stormGlass: StormGlassClient = new StormGlassClient()) {};

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectSources: BeachForecast[] = [];

      for (const beach of beaches) {
        const points: NormalizedForecastPoint[] = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData: BeachForecast[] = this.enrichBeachData(beach, points);

        pointsWithCorrectSources.push(...enrichedBeachData);
      }

      const mappedForecast: TimeForecast[] = this.mapForecastByTime(pointsWithCorrectSources);

      return mappedForecast;
    } catch (error) {
      throw new ForecastProcessingInternalError((error as Error).message);
    }
  }

  private enrichBeachData(beach: Beach, points: NormalizedForecastPoint[]): BeachForecast[] {
    const enrichedBeachData: BeachForecast[] = points
      .map((point: NormalizedForecastPoint): BeachForecast => ({
        ...{
          name: beach.name,
          lat: beach.lat,
          lng: beach.lng,
          position: beach.position,
          rating: 1
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