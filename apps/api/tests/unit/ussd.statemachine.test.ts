import { processUssdInput, type UssdSession } from '../../src/adapters/ussd.statemachine';

describe('USSD State Machine', () => {
  const baseSession: UssdSession = { step: 0, phone_number: '+256700000000' };

  it('returns root menu on empty input', () => {
    const result = processUssdInput(baseSession, '');
    expect(result.isEnd).toBe(false);
    expect(result.text).toContain('CON');
    expect(result.text).toContain('WETLABS');
    expect(result.nextSession.step).toBe(0);
  });

  it('advances to wetland selection on input "1"', () => {
    const result = processUssdInput(baseSession, '1');
    expect(result.isEnd).toBe(false);
    expect(result.nextSession.step).toBe(1);
    expect(result.text).toContain('Wetland Area');
  });

  it('sets wetland_code and advances to observation type', () => {
    const session: UssdSession = { ...baseSession, step: 1 };
    const result = processUssdInput(session, '1');
    expect(result.nextSession.wetland_code).toBe('KYO01');
    expect(result.nextSession.step).toBe(2);
  });

  it('sets observation_type and advances to severity', () => {
    const session: UssdSession = { ...baseSession, step: 2, wetland_code: 'KYO01' };
    const result = processUssdInput(session, '1');
    expect(result.nextSession.observation_type).toBe('FLOOD');
    expect(result.nextSession.step).toBe(3);
  });

  it('completes session with severity and returns END', () => {
    const session: UssdSession = {
      step: 3, phone_number: '+256700000000',
      wetland_code: 'KYO01', observation_type: 'FLOOD',
    };
    const result = processUssdInput(session, '3');
    expect(result.isEnd).toBe(true);
    expect(result.nextSession.severity).toBe('HIGH');
    expect(result.text).toContain('END');
  });

  it('returns to previous step on input "0"', () => {
    const session: UssdSession = { ...baseSession, step: 2, wetland_code: 'KYO01' };
    const result = processUssdInput(session, '0');
    expect(result.nextSession.step).toBe(1);
  });

  it('handles invalid wetland selection gracefully', () => {
    const session: UssdSession = { ...baseSession, step: 1 };
    const result = processUssdInput(session, '9');
    expect(result.isEnd).toBe(false);
    expect(result.nextSession.step).toBe(1); // stays on same step
  });
});
