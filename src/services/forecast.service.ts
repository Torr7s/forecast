import { StormGlassClient } from '@src/clients/stormGlass.client';

import {
  Beach,
  BeachForecast,
  NormalizedForecastPoint,
  TimeForecast
} from '@src/typings';

export class ForecastService {
  constructor(protected stormGlass: StormGlassClient = new StormGlassClient()) { };

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];

    for (const beach of beaches) {
      const points: NormalizedForecastPoint[] = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

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

      pointsWithCorrectSources.push(...enrichedBeachData);
    }

    const mappedForecast: TimeForecast[] = this.mapForecastByTime(pointsWithCorrectSources);

    return mappedForecast;
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