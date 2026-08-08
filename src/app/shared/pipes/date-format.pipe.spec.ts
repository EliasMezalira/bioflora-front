import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;

  beforeEach(() => {
    pipe = new DateFormatPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string when value is nullish', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined as unknown as string)).toBe('');
  });

  it('should format ISO string and Date values', () => {
    const isoDate = '2024-05-09T12:30:00';
    const dateValue = new Date(2024, 4, 9, 12, 30, 0);

    expect(pipe.transform(isoDate, 'dd/MM/yyyy HH:mm')).toBe('09/05/2024 12:30');
    expect(pipe.transform(dateValue, 'dd/MM/yyyy HH:mm')).toBe('09/05/2024 12:30');
  });
});
