-- V5__create_audit_log.sql
CREATE TABLE audit_log (
  log_id      BIGSERIAL    PRIMARY KEY,
  actor_id    UUID         REFERENCES users(user_id) ON DELETE SET NULL,
  action      VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id   UUID,
  meta        JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_actor  ON audit_log (actor_id, created_at DESC);
CREATE INDEX idx_audit_action ON audit_log (action, created_at DESC);
CREATE INDEX idx_audit_meta   ON audit_log USING GIN (meta);
