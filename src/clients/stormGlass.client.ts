import { AxiosResponse, AxiosStatic } from 'axios';

export class StormGlassClient {
  readonly stormGlassApiParams: string = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassApiSource: string = 'noaa';

  constructor(protected request: AxiosStatic) {};

  public async fetchPoints(lat: number, lng: number): Promise<AxiosResponse> {
    const url: string = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}&end=1592113802`;

    return this.request.get(url);
  }
}