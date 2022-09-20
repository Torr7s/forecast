import { StormGlassClient } from '@src/clients/stormGlass.client';

import { ForecastService } from '../forecast.service';
import { ForecastProcessingInternalError } from '@src/shared/utils/errors/forecast/processing.error';

import stormGlassNormalized3HoursFixture from '@tests/fixtures/stormglass_normalized_response_3_hours.json';

import { Beach, BeachPosition } from '@src/shared/infra/mongo/models/beach.model';

import { TimeForecast } from '@src/typings';

jest.mock('@src/clients/stormGlass.client');

describe('Forecast Service', (): void => {
  const mockedStormGlassService = new StormGlassClient() as jest.Mocked<StormGlassClient>;

  it('should return the forecast for a list of beaches', async (): Promise<void> => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(stormGlassNormalized3HoursFixture);

    const beaches: Beach[] = [{
      lat: -33.792726,
      lng: 141.289824,
      name: 'Manly',
      position: BeachPosition.E,
      user: 'fake-user-id'
    }];

    const expectedResponse = [
      {
        time: '2022-09-10T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 141.289824,
            name: 'Manly',
            position: 'East',
            rating: 1,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 3.89,
            time: '2022-09-10T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 0.47,
            windDirection: 299.45,
            windSpeed: 100
          }
        ]
      },
      {
        time: '2022-09-10T01:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 141.289824,
            name: 'Manly',
            position: 'East',
            rating: 1,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2022-09-10T01:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100
          }
        ]
      },
      {
        time: '2022-09-10T02:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 141.289824,
            name: 'Manly',
            position: 'East',
            rating: 1,
            swellDirection: 182.56,
            swellHeight: 0.28,
            swellPeriod: 3.44,
            time: '2022-09-10T02:00:00+00:00',
            waveDirection: 232.86,
            waveHeight: 0.46,
            windDirection: 321.5,
            windSpeed: 100
          }
        ]
      }
    ];

    const forecast = new ForecastService(mockedStormGlassService);
    const beachesWithRating: TimeForecast[] = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it('should return an empty list when the beaches array is empty', async (): Promise<void> => {
    const forecast: ForecastService = new ForecastService();
    const response: TimeForecast[] = await forecast.processForecastForBeaches([]);

    expect(response).toEqual([]);
  });

  it('should throwing internal processing error when something goes wrong during rating process', async (): Promise<void> => {
    const beaches: Beach[] = [{
      lat: -33.792726,
      lng: 141.289824,
      name: 'Manly',
      position: BeachPosition.E,
      user: 'fake-user-id'
    }];

    mockedStormGlassService.fetchPoints.mockRejectedValue('Error fetching data');

    const forecast: ForecastService = new ForecastService(mockedStormGlassService);

    expect(async (): Promise<void> => {
      await forecast.processForecastForBeaches(
        beaches
      )
    }).rejects.toThrow(ForecastProcessingInternalError);
  });
});