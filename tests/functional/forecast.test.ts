import nock from 'nock';

import { Beach, GeoPosition } from '@src/shared/infra/mongo/models/beach.model';
import { User, UserModel } from '@src/shared/infra/mongo/models/user.model';

import apiForecastResponse1BeachFixture from '@tests/fixtures/api_forecast_response_1_beach.json';
import stormGlassWeather3HoursFixture from '@tests/fixtures/stormglass_weather_3_hours.json';

import { AuthProvider } from '@src/shared/container/providers/auth/auth.provider';

describe('Beach forecast functional tests', (): void => {
  const defaultUser = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'youshallnotpass'
  }

  let user: UserModel;
  let token: string;

  beforeEach(async (): Promise<void> => {
    await Beach.deleteMany();
    await User.deleteMany();

    user = await new User(defaultUser).save();

    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: GeoPosition.E,
      user: user.id
    }

    await new Beach(defaultBeach).save();

    token = AuthProvider.signToken(user.id);
  });

  it('should return a forecast with just a few times', async (): Promise<void> => {
    const nockQuery = {
      lat: '-33.792726',
      lng: '151.289824',
      params: /(.*)/,
      source: 'noaa',
      end: /(.*)/
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
      }).get('/v2/weather/point').query(nockQuery).reply(200, stormGlassWeather3HoursFixture)

    const { body, status } = await global.testRequest
      .get('/api/forecast')
      .set({ 'x-access-token': token });

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

    const { status } = await global.testRequest
      .get('/api/forecast')
      .set({ 'x-access-token': token });

    expect(status).toBe(500);
  });

  afterAll(async (): Promise<void> => {
    await Beach.deleteMany();
    await User.deleteMany();
  });
});