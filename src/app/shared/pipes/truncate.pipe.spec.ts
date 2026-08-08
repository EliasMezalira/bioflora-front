import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string when value is nullish', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(undefined as unknown as string)).toBe('');
  });

  it('should truncate long values and keep short values', () => {
    expect(pipe.transform('abcdefghij', 5)).toBe('abcde...');
    expect(pipe.transform('abc', 5)).toBe('abc');
  });
});
