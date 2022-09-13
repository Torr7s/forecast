import { Request, Response } from '@src/shared/utils/request';

import { StormGlassClient } from '../stormGlass.client';

import stormGlassWeather3HoursFixture from '@tests/fixtures/stormglass_weather_3_hours.json';
import stormGlassNormalized3HoursFixture from '@tests/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('@src/shared/utils/request');

describe('StormGlass Client', (): void => {
  const MockedRequestClass = Request as jest.Mocked<
    typeof Request
  >;

  /**
   * typeof has been removed because HTTP.Request is a class instance, not 
   * the class itself
   */
  const mockedRequest = new Request() as jest.Mocked<Request>;

  it('should return the normalized forecast from the StormGlass service', async (): Promise<void> => {
    const lat: number = -33.792726;
    const lng: number = 151.289824;

    mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture } as Response);

    const stormGlass: StormGlassClient = new StormGlassClient(mockedRequest);
    const response: NormalizedForecastPoint[] = await stormGlass.fetchPoints(lat, lng);

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
          time: '2020-04-26T00:00:00+00:00'
        }
      ]
    }

    mockedRequest.get.mockResolvedValue({ data: incompleteResponse } as Response);

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
        'Unexpected error returned by the StormGlass service: "Error: {"errors":["Too Many Requests"]} Code: 429"'
      );
  });
});