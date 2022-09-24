import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export class DateProvider {
  public static getUnixTimeForAFutureDay(days: number): number {
    return dayjs().add(days, 'days').unix();
  }
}