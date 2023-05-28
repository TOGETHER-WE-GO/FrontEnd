import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcToLocalTime',
})
export class UtcToLocalTimePipe implements PipeTransform {
  transform(utcDate: Date, format: string): string {
    var browserLanguage = navigator.language;

    if (format === 'short') {
      let date = utcDate.toLocaleDateString(browserLanguage);
      let time = utcDate.toLocaleTimeString(browserLanguage);

      return `${date}, ${time}`;
    } else if (format === 'shortDate') {
      return utcDate.toLocaleDateString(browserLanguage);
    } else if (format === 'shortTime') {
      return utcDate.toLocaleTimeString(browserLanguage);
    } else if (format === 'full') {
      return utcDate.toString();
    } else {
      console.error(`Do not have logic to format utc date, format:${format}`);
      return utcDate.toString();
    }
  }
}
