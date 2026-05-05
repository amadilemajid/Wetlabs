-- V4__create_users.sql
CREATE TYPE user_role AS ENUM
  ('FIELD_ENUMERATOR','WETLAND_OFFICER','RESEARCHER','NGO_PARTNER','SYSTEM_ADMIN');

CREATE TABLE users (
  user_id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email             VARCHAR(255) NOT NULL UNIQUE,
  password_hash     VARCHAR(255) NOT NULL,
  full_name         VARCHAR(200) NOT NULL,
  role              user_role    NOT NULL,
  assigned_wetlands VARCHAR(20)[] NOT NULL DEFAULT '{}',
  is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
  last_login_at     TIMESTAMPTZ,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role  ON users (role);
