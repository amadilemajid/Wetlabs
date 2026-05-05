import { describe, it, expect } from 'vitest';
import { SEVERITY_CONFIG, OBS_TYPE_LABELS } from '@utils/severity';

describe('SEVERITY_CONFIG', () => {
  it('has entries for all three severity levels', () => {
    expect(SEVERITY_CONFIG).toHaveProperty('HIGH');
    expect(SEVERITY_CONFIG).toHaveProperty('MEDIUM');
    expect(SEVERITY_CONFIG).toHaveProperty('LOW');
  });

  it('each entry has a colour (valid CSS hex)', () => {
    Object.values(SEVERITY_CONFIG).forEach(cfg => {
      expect(cfg.colour).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

describe('OBS_TYPE_LABELS', () => {
  it('maps VEGETATION_CHANGE to human-readable string', () => {
    expect(OBS_TYPE_LABELS['VEGETATION_CHANGE']).toBe('Vegetation Change');
  });

  it('maps ENCROACHMENT correctly', () => {
    expect(OBS_TYPE_LABELS['ENCROACHMENT']).toBe('Encroachment');
  });
});
