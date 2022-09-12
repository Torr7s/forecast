import { AxiosError, AxiosResponse, AxiosStatic } from 'axios';

import { ClientRequestError } from '@src/shared/utils/errors/stormGlass/client-request.error';
import { StormGlassResponseError } from '@src/shared/utils/errors/stormGlass/response.error';

export class StormGlassClient {
  readonly stormGlassApiUrl: string = 'https://api.stormglass.io/v2/';
  readonly stormGlassApiParams: string = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassApiSource: string = 'noaa';

  constructor(protected request: AxiosStatic) { };

  public async fetchPoints(lat: number, lng: number): Promise<NormalizedForecastPoint[]> {
    try {
      const url: string = `${this.stormGlassApiUrl}/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}`;
      const response: AxiosResponse<StormGlassForecastResponse> = await this.request.get<StormGlassForecastResponse>(url);

      return this.normalizeResponse(response.data);
    } catch (error) {
      const axiosError: AxiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.status) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(axiosError.response.data)} Code: ${axiosError.response.status}`
        );
      }

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
    const pointValues: StormGlassPointSource[] = Object.values(props);
    const pointPropsHasNoaa: boolean = pointValues.every((prop: StormGlassPointSource): boolean => !!prop[this.stormGlassApiSource]);

    return time && pointPropsHasNoaa;
  }
}