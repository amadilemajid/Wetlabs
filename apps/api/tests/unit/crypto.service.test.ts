import { hashMsisdn } from '../../src/services/crypto.service';

describe('Crypto Service', () => {
  beforeAll(() => {
    process.env['MSISDN_PEPPER'] = 'test_pepper_32_bytes_padded_here';
  });

  it('produces a 64-char hex hash for a valid MSISDN', () => {
    const hash = hashMsisdn('+256700000000');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });

  it('is deterministic — same input same output', () => {
    const h1 = hashMsisdn('+256700000000');
    const h2 = hashMsisdn('+256700000000');
    expect(h1).toBe(h2);
  });

  it('produces different hashes for different MSISDNs (NFR-10)', () => {
    const h1 = hashMsisdn('+256700000000');
    const h2 = hashMsisdn('+256711111111');
    expect(h1).not.toBe(h2);
  });
});
