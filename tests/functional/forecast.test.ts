import nock from 'nock';

import { Beach, BeachPosition } from '@src/shared/database/models/beach.model';

import apiForecastResponse1BeachFixture from '@tests/fixtures/api_forecast_response_1_beach.json';
import stormGlassWeather3HoursFixture from '@tests/fixtures/stormglass_weather_3_hours.json';

describe('Beach forecast functional tests', (): void => {
  beforeEach(async (): Promise<void> => {
    await Beach.deleteMany({});

    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
    }

    const beach = new Beach(defaultBeach);

    await beach.save();
  });

  it('should return a forecast with just a few times', async (): Promise<void> => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
      })
      .reply(200, stormGlassWeather3HoursFixture)

    const { body, status } = await global.testRequest.get('/api/forecast');

    expect(body).toEqual(apiForecastResponse1BeachFixture);

    expect(status).toBe(200);
  });
});