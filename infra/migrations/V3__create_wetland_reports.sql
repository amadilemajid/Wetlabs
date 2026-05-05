-- V3__create_wetland_reports.sql
CREATE TYPE observation_type AS ENUM
  ('FLOOD','DROUGHT','ENCROACHMENT','VEGETATION_CHANGE','POLLUTION','WILDLIFE','OTHER');
CREATE TYPE severity_level   AS ENUM ('LOW','MEDIUM','HIGH');
CREATE TYPE report_channel   AS ENUM ('USSD','SMS','WEB_FORM');
CREATE TYPE geo_source_type  AS ENUM ('GPS','CENTROID');

CREATE TABLE wetland_reports (
  report_id        UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_hash    VARCHAR(64)       NOT NULL,
  wetland_code     VARCHAR(20)       NOT NULL REFERENCES wetlands(wetland_code),
  observation_type observation_type  NOT NULL,
  severity         severity_level    NOT NULL,
  description      TEXT,
  location_point   GEOMETRY(POINT,4326),
  geo_source       geo_source_type   NOT NULL DEFAULT 'CENTROID',
  photo_url        VARCHAR(500),
  channel          report_channel    NOT NULL,
  ussd_session_id  VARCHAR(100),
  is_duplicate     BOOLEAN           NOT NULL DEFAULT FALSE,
  is_flagged       BOOLEAN           NOT NULL DEFAULT FALSE,
  flag_reason      TEXT,
  raw_payload      JSONB,
  created_at       TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  processed_at     TIMESTAMPTZ
);

CREATE INDEX idx_reports_geom     ON wetland_reports USING GIST (location_point);
CREATE INDEX idx_reports_wetland  ON wetland_reports (wetland_code, created_at DESC);
CREATE INDEX idx_reports_severity ON wetland_reports (severity, created_at DESC);
CREATE INDEX idx_reports_payload  ON wetland_reports USING GIN  (raw_payload);
CREATE INDEX idx_reports_dup_check ON wetland_reports (reporter_hash, wetland_code, created_at DESC);
