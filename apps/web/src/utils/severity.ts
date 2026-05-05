import type { SeverityLevel } from '@wetlabs/shared-types';

export const SEVERITY_CONFIG: Record<SeverityLevel, {
  label:    string;
  colour:   string;       // CSS colour for Leaflet markers
  tailwind: string;       // Tailwind class for badges
  bg:       string;
  border:   string;
}> = {
  HIGH:   { label: 'High',   colour: '#EF4444', tailwind: 'text-crimson-400', bg: 'bg-crimson-500/10',  border: 'border-crimson-500/30'  },
  MEDIUM: { label: 'Medium', colour: '#FBBF24', tailwind: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30'   },
  LOW:    { label: 'Low',    colour: '#22C55E', tailwind: 'text-green-400',   bg: 'bg-green-500/10',   border: 'border-green-500/30'    },
};

export const OBS_TYPE_LABELS: Record<string, string> = {
  FLOOD:             'Flood',
  DROUGHT:           'Drought',
  ENCROACHMENT:      'Encroachment',
  VEGETATION_CHANGE: 'Vegetation Change',
  POLLUTION:         'Pollution',
  WILDLIFE:          'Wildlife',
  OTHER:             'Other',
};
