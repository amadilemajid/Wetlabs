import crypto from 'crypto';

describe('MSISDN pseudonymisation', () => {
  const pepper = '0'.repeat(64);

  it('produces a 64-char hex hash', () => {
    const hash = crypto.createHmac('sha256', pepper).update('+254712345678').digest('hex');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });

  it('is deterministic for the same input', () => {
    const h1 = crypto.createHmac('sha256', pepper).update('+254712345678').digest('hex');
    const h2 = crypto.createHmac('sha256', pepper).update('+254712345678').digest('hex');
    expect(h1).toBe(h2);
  });

  it('differs across MSISDNs', () => {
    const h1 = crypto.createHmac('sha256', pepper).update('+254712345678').digest('hex');
    const h2 = crypto.createHmac('sha256', pepper).update('+254700000001').digest('hex');
    expect(h1).not.toBe(h2);
  });
});
