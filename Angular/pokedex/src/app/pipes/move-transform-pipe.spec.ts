import { MoveTransformPipe } from './move-transform-pipe';

describe('MoveTransformPipe', () => {
  let pipe: MoveTransformPipe;

  beforeEach(() => {
    pipe = new MoveTransformPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a hyphenated move name into capitalized words', () => {
    expect(pipe.transform('solar-beam')).toBe('Solar Beam');
  });

  it('should transform a single-word move name', () => {
    expect(pipe.transform('tackle')).toBe('Tackle');
  });

  it('should transform a move name with multiple hyphens', () => {
    expect(pipe.transform('double-kick')).toBe('Double Kick');
  });

  it('should handle an empty string', () => {
    expect(pipe.transform('')).toBe('');
  });
});
