import { StormGlassClient } from '@src/clients/stormGlass.client';
import { ForecastService } from '../forecast.service';

import stormGlassNormalized3HoursFixture from '@tests/fixtures/stormglass_normalized_response_3_hours.json';

import { Beach, BeachForecast, BeachPosition } from '@src/typings';

jest.mock('@src/clients/stormGlass.client');

describe('Forecast Service', (): void => {
  it('should return the forecast for a list of beaches', async (): Promise<void> => {
    StormGlassClient.prototype.fetchPoints = jest.fn().mockResolvedValue(stormGlassNormalized3HoursFixture);

    const beaches: Beach[] = [{
      lat: -33.792726,
      lng: 141.289824,
      name: 'Manly',
      position: BeachPosition.E,
      user: 'random'
    }];

    const expectedResponse = [
      {
        lat: -33.792726,
        lng: 141.289824,
        name: 'Manly',
        position: 'East',
        rating: 1,
        swellDirection: 64.26,
        swellHeight: 0.15,
        swellPeriod: 3.89,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 231.38,
        waveHeight: 0.47,
        windDirection: 299.45,
        windSpeed: 100,
      },
      {
        lat: -33.792726,
        lng: 141.289824,
        name: 'Manly',
        position: 'East',
        rating: 1,
        swellDirection: 123.41,
        swellHeight: 0.21,
        swellPeriod: 3.67,
        time: '2020-04-26T01:00:00+00:00',
        waveDirection: 232.12,
        waveHeight: 0.46,
        windDirection: 310.48,
        windSpeed: 100,
      },
      {
        lat: -33.792726,
        lng: 141.289824,
        name: 'Manly',
        position: 'East',
        rating: 1,
        swellDirection: 182.56,
        swellHeight: 0.28,
        swellPeriod: 3.44,
        time: '2020-04-26T02:00:00+00:00',
        waveDirection: 232.86,
        waveHeight: 0.46,
        windDirection: 321.5,
        windSpeed: 100
      }
    ];

    const forecast = new ForecastService(new StormGlassClient());
    const beachesWithRating: BeachForecast[] = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });
});