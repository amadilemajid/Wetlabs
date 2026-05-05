-- V8__seed_wetlands.sql
-- Seed wetland data for MVP testing

INSERT INTO wetlands (wetland_code, wetland_name, region, catchment, area_ha, boundary_geom, gazette_ref, is_active)
VALUES
  -- Kyoga Basin wetlands
  ('KYO01', 'Kyoga Basin — North', 'Northern Region', 'Lake Kyoga Catchment', 15000.00,
   ST_GeomFromText('POLYGON((32.5 1.5, 33.5 1.5, 33.5 2.5, 32.5 2.5, 32.5 1.5))', 4326),
   'GAZ-2015-KYO-001', TRUE),
  
  ('KYO02', 'Kyoga Basin — South', 'Central Region', 'Lake Kyoga Catchment', 12000.00,
   ST_GeomFromText('POLYGON((32.5 0.5, 33.5 0.5, 33.5 1.5, 32.5 1.5, 32.5 0.5))', 4326),
   'GAZ-2015-KYO-002', TRUE),
  
  -- Victoria Basin wetland
  ('VIC01', 'Victoria Basin', 'Central Region', 'Lake Victoria Catchment', 25000.00,
   ST_GeomFromText('POLYGON((32.0 -0.5, 33.0 -0.5, 33.0 0.5, 32.0 0.5, 32.0 -0.5))', 4326),
   'GAZ-2016-VIC-001', TRUE),
  
  -- Albert Basin wetland
  ('ALB01', 'Albert Basin', 'Western Region', 'Lake Albert Catchment', 18000.00,
   ST_GeomFromText('POLYGON((30.5 1.5, 31.5 1.5, 31.5 2.5, 30.5 2.5, 30.5 1.5))', 4326),
   'GAZ-2017-ALB-001', TRUE),
  
  -- Katonga Valley wetland
  ('KAT01', 'Katonga Valley', 'Western Region', 'Katonga River Catchment', 8500.00,
   ST_GeomFromText('POLYGON((31.0 -0.5, 32.0 -0.5, 32.0 0.5, 31.0 0.5, 31.0 -0.5))', 4326),
   'GAZ-2018-KAT-001', TRUE)
ON CONFLICT (wetland_code) DO NOTHING;
