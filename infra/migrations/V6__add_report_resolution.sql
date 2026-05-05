-- V6__add_report_resolution.sql
-- Completes the report lifecycle by allowing tracking of verified/resolved reports.

ALTER TABLE wetland_reports 
  ADD COLUMN is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN resolved_at TIMESTAMPTZ;

-- Index for searching resolved/unresolved reports
CREATE INDEX idx_reports_resolved ON wetland_reports (is_resolved, created_at DESC);

-- Audit log entry for the schema change
-- (Assuming the migration runner handles meta-auditing, 
-- but we could add a manual entry if needed).
