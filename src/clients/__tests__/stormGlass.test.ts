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
});