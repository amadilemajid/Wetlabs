// --- Enums --------------------------------------------------------------------
export type ObservationType =
  | 'FLOOD' | 'DROUGHT' | 'ENCROACHMENT'
  | 'VEGETATION_CHANGE' | 'POLLUTION' | 'WILDLIFE' | 'OTHER';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ReportChannel = 'USSD' | 'SMS' | 'WEB_FORM' | 'WEB';
export type UserRole =
  | 'FIELD_ENUMERATOR' | 'WETLAND_OFFICER'
  | 'RESEARCHER' | 'NGO_PARTNER' | 'SYSTEM_ADMIN';
export type GeoSource = 'GPS' | 'CENTROID';

// --- Core DTOs ----------------------------------------------------------------
export interface WetlandReportDTO {
  reporter_msisdn:  string;          // E.164 format
  wetland_code:     string;
  observation_type: ObservationType;
  severity:         SeverityLevel;
  description?:     string;
  channel:          ReportChannel;
  latitude?:        number;
  longitude?:       number;
  ussd_session_id?: string;
  raw_payload?:     Record<string, unknown>;
}

export interface WetlandReport extends WetlandReportDTO {
  report_id:    string;              // UUID
  reporter_hash: string;             // SHA-256 pseudonymised
  location_point?: GeoPoint;
  geo_source:   GeoSource;
  photo_url?:   string;
  is_duplicate: boolean;
  is_flagged:   boolean;
  flag_reason?: string;
  is_resolved:  boolean;
  resolved_at?: string;
  created_at:   string;             // ISO 8601
  processed_at?: string;
}

export interface Wetland {
  wetland_code:  string;
  wetland_name:  string;
  region:        string;
  catchment:     string;
  area_ha:       number;
  gazette_ref?:  string;
  is_active:     boolean;
  created_at:    string;
}

export interface User {
  user_id:           string;
  email:             string;
  full_name:         string;
  role:              UserRole;
  assigned_wetlands: string[];
  is_active:         boolean;
  last_login_at?:    string;
  created_at:        string;
}

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

// --- API shapes ---------------------------------------------------------------
export interface ApiSuccess<T> {
  data:  T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  error:   string;
  message: string;
  details?: unknown;
}

export interface PaginatedMeta {
  page:     number;
  per_page: number;
  total:    number;
}

export interface ReportFilters {
  wetland_code?:     string;
  from?:             string;
  to?:               string;
  severity?:         SeverityLevel[];
  observation_type?: ObservationType[];
  channel?:          ReportChannel[];
  bbox?:             [number, number, number, number]; // minLon,minLat,maxLon,maxLat
  page?:             number;
  per_page?:         number;
}

// --- Queue message shapes -----------------------------------------------------
export interface QueueMessage<T> {
  messageId:  string;
  timestamp:  string;
  retryCount: number;
  payload:    T;
}

export interface AlertPayload {
  report_id:        string;
  wetland_code:     string;
  wetland_name:     string;
  observation_type: ObservationType;
  severity:         SeverityLevel;
  created_at:       string;
}

export interface SmsMessage {
  to:      string;  // E.164 MSISDN
  message: string;  // max 160 chars for single SMS
}

// --- Audit log ----------------------------------------------------------------
export type AuditAction =
  | 'USER_LOGIN' | 'USER_LOGOUT' | 'USER_CREATED' | 'USER_DEACTIVATED'
  | 'REPORT_CREATED' | 'REPORT_FLAGGED' | 'REPORT_EXPORTED'
  | 'DLQ_RETRIED' | 'DLQ_DISCARDED';

export interface AuditEntry {
  log_id?:     number;
  actor_id?:   string;               // user_id (null for system actions)
  actor_email?: string;              // Add emitted email join
  action:      AuditAction;
  target_type?: string;              // e.g. 'wetland_report'
  target_id?:  string;               // UUID of affected record
  meta?:       Record<string, unknown>;
  ip_address?: string;
  created_at?: string;
}

// --- Export -------------------------------------------------------------------
export type ExportFormat = 'csv' | 'geojson';

export interface ExportFilters extends ReportFilters {
  format?: ExportFormat;
}

// --- GeoJSON helpers ----------------------------------------------------------
export interface GeoFeature<P = Record<string, unknown>> {
  type:       'Feature';
  geometry:   GeoPoint | null;
  properties: P;
}

export interface GeoFeatureCollection<P = Record<string, unknown>> {
  type:     'FeatureCollection';
  features: GeoFeature<P>[];
  meta?:    PaginatedMeta;
}

// --- Wetland summary ----------------------------------------------------------
export interface WetlandSummary {
  wetland_code:  string;
  wetland_name?: string;
  period:        { from: string; to: string };
  total_reports: number;
  by_type:       Array<{ observation_type: ObservationType; count: number | string }>;
  by_severity:   Array<{ severity: SeverityLevel; count: number | string }>;
  time_series:   Array<{ week: string; observation_type: string; count: number | string }>;
  satellite: {
    ndvi:  number | null;
    ndwi:  number | null;
    stale: boolean;
  };
}
