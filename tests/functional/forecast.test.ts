import nock from 'nock';

import { Beach, BeachModel, BeachPosition } from '@src/shared/database/models/beach.model';
import { User, UserModel } from '@src/shared/database/models/user.model';

import apiForecastResponse1BeachFixture from '@tests/fixtures/api_forecast_response_1_beach.json';
import stormGlassWeather3HoursFixture from '@tests/fixtures/stormglass_weather_3_hours.json';

describe('Beach forecast functional tests', (): void => {
  const defaultUser = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'youshallnotpass'
  }

  let user: UserModel;

  beforeEach(async (): Promise<void> => {
    await Beach.deleteMany();
    await User.deleteMany();

    user = await new User(defaultUser).save();

    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
      user: user.id
    }

    const beach: BeachModel = await new Beach(defaultBeach).save();
  });

  it('should return a forecast with just a few times', async (): Promise<void> => {
    const nockQuery = {
      lat: '-33.792726',
      lng: '151.289824',
      params: /(.*)/,
      source: 'noaa'
    }

    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => 
          true,
      }
    })
      .defaultReplyHeaders({
        'access-control-allow-origin':
          '*'
      }).get('/v2/weather/point').query(nockQuery).reply(200, stormGlassWeather3HoursFixture)

    const { body, status } = await global.testRequest.get('/api/forecast');

    expect(status).toBe(200);
    expect(body).toEqual(apiForecastResponse1BeachFixture);
  });

  it('should return 500 if something goes wrong during processing', async (): Promise<void> => {
    const nockQuery = {
      lat: '-33.792726',
      lng: '151.289824'
    }

    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => 
          true
      }
    })
      .defaultReplyHeaders({
        'access-control-allow-origin':
          '*'
      }).get('/v2/weather/point').query(nockQuery).replyWithError('Something went wrong');

    const { status } = await global.testRequest.get('/api/forecast');

    expect(status).toBe(500);
  });
});