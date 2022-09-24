import * as HTTPUtil from '@src/shared/utils/request';

import { StormGlassClient } from '../stormGlass.client';

import stormGlassWeather3HoursFixture from '@tests/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@tests/fixtures/stormglass_normalized_response_3_hours.json';

import CacheUtil from '@src/shared/utils/cache';

import { NormalizedForecastPoint } from '@src/typings';

jest.mock('@src/shared/utils/request');
jest.mock('@src/shared/utils/cache');

describe('StormGlass Client', (): void => {
  /**
   * Used for static method's mocks
   */
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;
  const MockedCacheUtil = CacheUtil as jest.Mocked<typeof CacheUtil>;

  /**
   * Used for instance method's mocks
   */
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it('should return the normalized forecast from the StormGlass service', async (): Promise<void> => {
    const lat: number = -33.792726;
    const lng: number = 151.289824;

    mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture } as HTTPUtil.Response);

    MockedCacheUtil.get.mockReturnValue(undefined);

    const stormGlassClient: StormGlassClient = new StormGlassClient(mockedRequest, MockedCacheUtil);
    const response: NormalizedForecastPoint[] = await stormGlassClient.fetchPointWeatherData(lat, lng);

    expect(response).toEqual(stormGlassNormalized3HoursFixture);
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
          time: '2022-09-10T00:00:00+00:00'
        }
      ]
    }

    mockedRequest.get.mockResolvedValue({ data: incompleteResponse } as HTTPUtil.Response);

    MockedCacheUtil.get.mockReturnValue(undefined);

    const stormGlassClient: StormGlassClient = new StormGlassClient(mockedRequest, MockedCacheUtil);
    const response: NormalizedForecastPoint[] = await stormGlassClient.fetchPointWeatherData(lat, lng);

    expect(response).toEqual([]);
  });

  it('should get the normalized forecast points from cache and use it to return data points', async (): Promise<void> => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockResolvedValue({ data: null } as HTTPUtil.Response);

    MockedCacheUtil.get.mockReturnValue(stormGlassNormalized3HoursFixture);

    const stormGlassClient: StormGlassClient = new StormGlassClient(mockedRequest, MockedCacheUtil);
    const response: NormalizedForecastPoint[] = await stormGlassClient.fetchPointWeatherData(lat, lng);

    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async (): Promise<void> => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue('Network Error');

    MockedCacheUtil.get.mockReturnValue(undefined);

    const stormGlassClient: StormGlassClient = new StormGlassClient(mockedRequest, MockedCacheUtil);

    expect(async (): Promise<void> => {
      await stormGlassClient.fetchPointWeatherData(
        lat,
        lng
      )
    }).rejects.toThrow(`Unexpected error when trying to communicate to StormGlass: "Network Error"`);
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with an error', async (): Promise<void> => {
    const lat = -33.792726;
    const lng = 151.289824;
    
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: {
          errors: [
            'Too Many Requests'
          ]
        }
      }
    });

    MockedRequestClass.isRequestError.mockReturnValue(true);

    MockedCacheUtil.get.mockReturnValue(undefined);

    const stormGlassClient: StormGlassClient = new StormGlassClient(mockedRequest, MockedCacheUtil);

    expect(async (): Promise<void> => {
      await stormGlassClient.fetchPointWeatherData(
        lat,
        lng
      )
    }).rejects.toThrow(`Unexpected error returned by the StormGlass service: "Error: {"errors":["Too Many Requests"]} Code: 429"`);
  });
});