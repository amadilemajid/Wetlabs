-- V2__create_wetlands.sql
CREATE TABLE wetlands (
  wetland_code   VARCHAR(20)            PRIMARY KEY,
  wetland_name   VARCHAR(200)           NOT NULL,
  region         VARCHAR(100)           NOT NULL,
  catchment      VARCHAR(100)           NOT NULL,
  area_ha        NUMERIC(12,2)          NOT NULL,
  boundary_geom  GEOMETRY(POLYGON,4326) NOT NULL,
  centroid_geom  GEOMETRY(POINT,4326)   GENERATED ALWAYS AS (ST_Centroid(boundary_geom)) STORED,
  gazette_ref    VARCHAR(100),
  is_active      BOOLEAN                NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ            NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wetlands_boundary ON wetlands USING GIST (boundary_geom);
CREATE INDEX idx_wetlands_centroid  ON wetlands USING GIST (centroid_geom);
