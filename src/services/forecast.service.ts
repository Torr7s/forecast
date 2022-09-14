import { StormGlassClient } from '@src/clients/stormGlass.client';

import { Beach, BeachForecast, NormalizedForecastPoint } from '@src/typings';

export class ForecastService {
  constructor(protected stormGlass: StormGlassClient = new StormGlassClient()) {};

  public async processForecastForBeaches(beaches: Beach[]): Promise<BeachForecast[]> {
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

    return pointsWithCorrectSources;
  }
}