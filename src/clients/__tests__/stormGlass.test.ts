import axios, { AxiosStatic } from 'axios';

import { StormGlassClient } from '../stormGlass.client';

import stormGlassWeather3HoursFixture from '@tests/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixtures from '@tests/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('axios');

describe('StormGlass Client', (): void => {
  const mockedAxios: jest.Mocked<AxiosStatic> = axios as jest.Mocked<typeof axios>;

  it('should return the normalized forecast from the StormGlass service', async (): Promise<void> => {
    const lat: number = -33.792726;
    const lng: number = 151.289824;

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture });

    const stormGlass: StormGlassClient = new StormGlassClient(mockedAxios);
    const response: NormalizedForecastPoint[] = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalized3HoursFixtures);
  });

  it('should exclude incomplete data points', async (): Promise<void> => {
    const lat: number = -33.792726;
    const lng: number = 151.289824;

    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: '2020-04-26T00:00:00+00:00'
        }
      ]
    }

    mockedAxios.get.mockResolvedValue({ data: incompleteResponse });

    const stormGlass: StormGlassClient = new StormGlassClient(mockedAxios);
    const response: NormalizedForecastPoint[] = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async (): Promise<void> => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockRejectedValue('Network Error');

    const stormGlass: StormGlassClient = new StormGlassClient(mockedAxios);

    await expect(stormGlass.fetchPoints(lat, lng))
      .rejects
      .toThrow(
        'Unexpected error when trying to communicate to StormGlass: "Network Error"'
      );
  });
});