import type { ObservationType, SeverityLevel, WetlandReportDTO } from '@wetlabs/shared-types';

export interface ParsedSms {
  success: boolean;
  data?:   Partial<WetlandReportDTO>;
  error?:  string;
}

const OBS_MAP: Record<string, ObservationType> = {
  'FLOOD':      'FLOOD',
  'DROUGHT':    'DROUGHT',
  'ENCROACH':   'ENCROACHMENT',
  'VEG':        'VEGETATION_CHANGE',
  'POLLUTE':    'POLLUTION',
  'WILD':       'WILDLIFE',
  'OTHER':      'OTHER',
};

const SEV_MAP: Record<string, SeverityLevel> = {
  'LOW':    'LOW',
  'MED':    'MEDIUM',
  'MEDIUM': 'MEDIUM',
  'HIGH':   'HIGH',
};

/**
 * Parses SMS format: WET [CODE] [TYPE] [SEVERITY]
 * Example: WET KYO01 FLOOD HIGH
 */
export function parseSmsReport(text: string, msisdn: string): ParsedSms {
  const parts = text.trim().toUpperCase().split(/\s+/);
  
  if (parts[0] !== 'WET' || parts.length < 4) {
    return {
      success: false,
      error: 'Invalid format. Use: WET [CODE] [TYPE] [SEVERITY]. Example: WET KYO01 FLOOD HIGH',
    };
  }

  const wetland_code = parts[1]!;
  const rawType      = parts[2]!;
  const rawSev       = parts[3]!;

  const observation_type = OBS_MAP[rawType];
  const severity         = SEV_MAP[rawSev];

  if (!observation_type) {
    return {
      success: false,
      error: `Invalid type: ${rawType}. Use: FLOOD, DROUGHT, ENCROACH, VEG, POLLUTE, WILD, or OTHER`,
    };
  }

  if (!severity) {
    return {
      success: false,
      error: `Invalid severity: ${rawSev}. Use: LOW, MED, or HIGH`,
    };
  }

  return {
    success: true,
    data: {
      reporter_msisdn:  msisdn,
      wetland_code,
      observation_type,
      severity,
      channel: 'SMS',
    },
  };
}
