// Pure function state machine — no side effects, fully testable (SRS 5.2)
import { type ObservationType, type SeverityLevel } from '@wetlabs/shared-types';

export interface UssdSession {
  step:             number;
  wetland_code?:    string;
  observation_type?: ObservationType;
  severity?:        SeverityLevel;
  phone_number:     string;
}

export interface UssdResponse {
  text:        string;
  isEnd:       boolean;
  nextSession: UssdSession;
}

// Wetland areas presented in the menu — in production, load from DB
const WETLAND_MAP: Record<string, string> = {
  '1': 'KYO01', // Kyoga Basin
  '2': 'VIC01', // Victoria Basin
  '3': 'ALB01', // Albert Basin
};

const OBSERVATION_MAP: Record<string, ObservationType> = {
  '1': 'FLOOD', '2': 'DROUGHT', '3': 'ENCROACHMENT',
  '4': 'VEGETATION_CHANGE', '5': 'POLLUTION', '6': 'OTHER',
};

const SEVERITY_MAP: Record<string, SeverityLevel> = {
  '1': 'LOW', '2': 'MEDIUM', '3': 'HIGH',
};

export function processUssdInput(
  session: UssdSession,
  userInput: string,
): UssdResponse {
  const step = session.step;

  // Step 0 → Root menu
  if (step === 0) {
    if (userInput === '' || userInput === '0') {
      return {
        isEnd: false,
        text: 'CON Welcome to WETLABS\n1. Report Observation\n2. My Reports\n3. Help\n0. Exit',
        nextSession: { ...session, step: 0 },
      };
    }
    if (userInput === '1') {
      return {
        isEnd: false,
        text: 'CON Select Wetland Area\n1. Kyoga Basin\n2. Victoria Basin\n3. Albert Basin\n0. Back',
        nextSession: { ...session, step: 1 },
      };
    }
    if (userInput === '0') {
      return { isEnd: true, text: 'END Goodbye. Thank you for using WETLABS.', nextSession: session };
    }
    return { isEnd: false, text: 'CON Invalid option.\n1. Report\n0. Exit', nextSession: session };
  }

  // Step 1 → Wetland selection
  if (step === 1) {
    if (userInput === '0') {
      return { isEnd: false, text: 'CON Welcome to WETLABS\n1. Report\n0. Exit', nextSession: { ...session, step: 0 } };
    }
    const code = WETLAND_MAP[userInput];
    if (!code) {
      return { isEnd: false, text: 'CON Invalid selection.\n1. Kyoga\n2. Victoria\n3. Albert\n0. Back', nextSession: session };
    }
    return {
      isEnd: false,
      text: 'CON Select Observation Type\n1. Flood\n2. Drought\n3. Encroachment\n4. Vegetation Change\n5. Pollution\n6. Other\n0. Back',
      nextSession: { ...session, step: 2, wetland_code: code },
    };
  }

  // Step 2 → Observation type
  if (step === 2) {
    if (userInput === '0') {
      return { isEnd: false, text: 'CON Select Wetland Area\n1. Kyoga\n2. Victoria\n3. Albert\n0. Back', nextSession: { ...session, step: 1 } };
    }
    const obsType = OBSERVATION_MAP[userInput];
    if (!obsType) {
      return { isEnd: false, text: 'CON Invalid. Select type:\n1. Flood\n2. Drought\n3. Encroach\n4. Veg\n5. Pollution\n6. Other\n0. Back', nextSession: session };
    }
    return {
      isEnd: false,
      text: 'CON Select Severity\n1. Low\n2. Medium\n3. High\n0. Back',
      nextSession: { ...session, step: 3, observation_type: obsType },
    };
  }

  // Step 3 → Severity → END and enqueue
  if (step === 3) {
    if (userInput === '0') {
      return { isEnd: false, text: 'CON Select Observation Type\n1. Flood\n2. Drought\n3. Encroach\n4. Veg\n5. Pollution\n0. Back', nextSession: { ...session, step: 2 } };
    }
    const severity = SEVERITY_MAP[userInput];
    if (!severity) {
      return { isEnd: false, text: 'CON Invalid severity.\n1. Low\n2. Medium\n3. High\n0. Back', nextSession: session };
    }
    return {
      isEnd: true,
      text: 'END Submitting your report... You will receive an SMS confirmation shortly. Thank you!',
      nextSession: { ...session, step: 4, severity },
    };
  }

  return { isEnd: true, text: 'END Session expired. Please dial again.', nextSession: session };
}
