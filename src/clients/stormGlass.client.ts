import config, { IConfig } from 'config';

import { Request, Response } from '@src/shared/utils/request';

import { ClientRequestError } from '@src/shared/utils/errors/stormGlass/client-request.error';
import { StormGlassResponseError } from '@src/shared/utils/errors/stormGlass/response.error';

import { 
  NormalizedForecastPoint, 
  StormGlassForecastResponse, 
  StormGlassPoint, 
  StormGlassPointSource 
} from '@src/typings';

import { DateProvider } from '@src/shared/container/providers/date/date.provider';

const stormGlassResourceConfig: IConfig = config.get('app.resources.stormGlass');

export class StormGlassClient {
  readonly stormGlassApiParams: string = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassApiSource: string = 'noaa';

  constructor(protected request: Request = new Request()) {};

  public async fetchPointWeatherData(lat: number, lng: number): Promise<NormalizedForecastPoint[]> {
    try {
      const endTimestamp: number = DateProvider.getUnixTimeForAFutureDay(1);

      const url: string = `${stormGlassResourceConfig.get('apiUrl')}/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}&end=${endTimestamp}`;

      const response: Response<StormGlassForecastResponse> = await this.request.get<StormGlassForecastResponse>(url, {
        headers: {
          Authorization: stormGlassResourceConfig.get('apiToken')
        }
      });

      const normalizedResponse: NormalizedForecastPoint[] = this.normalizeResponse(response.data);

      return normalizedResponse;
    } catch (error) {
      if (Request.isRequestError(error))
        throw new StormGlassResponseError(error);

      throw new ClientRequestError(error);
    }
  }

  private normalizeResponse(points: StormGlassForecastResponse): NormalizedForecastPoint[] {
    const pointParams: string[] = ['time', ...this.stormGlassApiParams.split(',')]

    const validPoints: (any | StormGlassPoint)[] = points
      .hours
      .map((point: StormGlassPoint): any | StormGlassPoint =>
        !pointParams.every((key: string): any => point[key]) ? [] : point)

    return validPoints
      .filter(this.isValidPoint.bind(this))
      .map((point: StormGlassPoint) => ({
        time: point.time,
        swellDirection: point.swellDirection[this.stormGlassApiSource],
        swellHeight: point.swellHeight[this.stormGlassApiSource],
        swellPeriod: point.swellPeriod[this.stormGlassApiSource],
        waveDirection: point.waveDirection[this.stormGlassApiSource],
        waveHeight: point.waveHeight[this.stormGlassApiSource],
        windDirection: point.windDirection[this.stormGlassApiSource],
        windSpeed: point.windSpeed[this.stormGlassApiSource]
      }));
  }

  private isValidPoint({ time, ...props }: Partial<StormGlassPoint>): boolean {
    const validPropsWithNoaa: boolean = Object.values(props).every((prop: StormGlassPointSource): boolean => !!prop[this.stormGlassApiSource]);

    return time && validPropsWithNoaa;
  }
}