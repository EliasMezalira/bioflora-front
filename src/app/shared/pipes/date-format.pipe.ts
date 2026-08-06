import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | null, pattern = 'dd/MM/yyyy HH:mm'): string {
    if (!value) {
      return '';
    }
    const date = typeof value === 'string' ? parseISO(value) : value;
    return format(date, pattern);
  }
}
