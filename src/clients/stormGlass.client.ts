import { AxiosResponse, AxiosStatic } from 'axios';

export class StormGlassClient {
  readonly stormGlassApiUrl: string = 'https://api.stormglass.io/v2/';
  readonly stormGlassApiParams: string = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassApiSource: string = 'noaa';

  constructor(protected request: AxiosStatic) { };

  public async fetchPoints(lat: number, lng: number): Promise<NormalizedForecastPoint[]> {
    const url: string = `${this.stormGlassApiUrl}/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}`;
    const response: AxiosResponse<StormGlassForecastResponse> = await this.request.get<StormGlassForecastResponse>(url);

    return this.normalizeResponse(response.data);
  }

  private normalizeResponse(points: StormGlassForecastResponse): NormalizedForecastPoint[] {
    return points.hours
      .filter(this.isValidPoint.bind(this))
      .map((point: StormGlassPoint) => ({
        swellDirection: point.swellDirection[this.stormGlassApiSource],
        swellHeight: point.swellHeight[this.stormGlassApiSource],
        swellPeriod: point.swellPeriod[this.stormGlassApiSource],
        time: point.time,
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