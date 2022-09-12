import * as HTTPUtil from '@src/shared/utils/request';

import { StormGlassClient } from '../stormGlass.client';

import stormGlassWeather3HoursFixture from '@tests/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixtures from '@tests/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('@src/shared/utils/request');

describe('StormGlass Client', (): void => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;

  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it('should return the normalized forecast from the StormGlass service', async (): Promise<void> => {
    const lat: number = -33.792726;
    const lng: number = 151.289824;

    mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture } as HTTPUtil.Response);

    const stormGlass: StormGlassClient = new StormGlassClient();
    // ClientRequestError: Unexpected error when trying to communicate to StormGlass: "TypeError: Cannot read properties of undefined (reading 'data')"
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

    mockedRequest.get.mockResolvedValue({ data: incompleteResponse } as HTTPUtil.Response);

    const stormGlass: StormGlassClient = new StormGlassClient(mockedRequest);
    const response: NormalizedForecastPoint[] = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async (): Promise<void> => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue('Network Error');

    const stormGlass: StormGlassClient = new StormGlassClient(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng))
      .rejects
      .toThrow(
        'Unexpected error when trying to communicate to StormGlass: "Network Error"'
      );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with an error', async (): Promise<void> => {
    const lat = -33.792726;
    const lng = 151.289824;

    MockedRequestClass.isRequestError.mockReturnValue(true);

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

    const stormGlass: StormGlassClient = new StormGlassClient(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng))
      .rejects
      .toThrow(
        'Unexpected error returned by the StormGlass service: Error: {"errors":["Too Many Requests"]} Code: 429'
      );
  });
});