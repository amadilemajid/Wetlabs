-- V9__seed_reports.sql
-- Seed test reports across all wetlands for dashboard testing

INSERT INTO wetland_reports (reporter_hash, wetland_code, observation_type, severity, description, location_point, geo_source, channel, created_at)
VALUES
  -- KYO01 reports
  ('hash001', 'KYO01', 'POLLUTION',          'HIGH',   'Industrial waste dumped near northern inlet', ST_GeomFromText('POINT(33.0 2.0)', 4326),  'GPS',      'USSD',     NOW() - INTERVAL '2 days'),
  ('hash002', 'KYO01', 'ENCROACHMENT',        'HIGH',   'Illegal farming on wetland edge',             ST_GeomFromText('POINT(32.8 1.8)', 4326),  'GPS',      'SMS',      NOW() - INTERVAL '5 days'),
  ('hash003', 'KYO01', 'VEGETATION_CHANGE',   'MEDIUM', 'Papyrus thinning observed',                   ST_GeomFromText('POINT(33.1 1.9)', 4326),  'GPS',      'WEB_FORM', NOW() - INTERVAL '8 days'),
  ('hash004', 'KYO01', 'FLOOD',               'HIGH',   'Water levels 2m above normal',                ST_GeomFromText('POINT(32.9 2.1)', 4326),  'GPS',      'USSD',     NOW() - INTERVAL '10 days'),
  ('hash005', 'KYO01', 'WILDLIFE',            'LOW',    'Shoebill stork nesting site spotted',         ST_GeomFromText('POINT(33.2 2.2)', 4326),  'GPS',      'SMS',      NOW() - INTERVAL '12 days'),

  -- KYO02 reports
  ('hash006', 'KYO02', 'DROUGHT',             'MEDIUM', 'Water level dropping significantly',          ST_GeomFromText('POINT(33.0 1.0)', 4326),  'GPS',      'USSD',     NOW() - INTERVAL '1 day'),
  ('hash007', 'KYO02', 'POLLUTION',           'HIGH',   'Oil spill from nearby road',                  ST_GeomFromText('POINT(32.7 0.8)', 4326),  'GPS',      'SMS',      NOW() - INTERVAL '3 days'),
  ('hash008', 'KYO02', 'ENCROACHMENT',        'MEDIUM', 'New settlement expanding into buffer zone',   ST_GeomFromText('POINT(33.2 1.2)', 4326),  'CENTROID', 'USSD',     NOW() - INTERVAL '7 days'),
  ('hash009', 'KYO02', 'VEGETATION_CHANGE',   'LOW',    'Seasonal grass change, monitoring needed',    ST_GeomFromText('POINT(32.9 0.9)', 4326),  'GPS',      'WEB_FORM', NOW() - INTERVAL '15 days'),

  -- VIC01 reports
  ('hash010', 'VIC01', 'POLLUTION',           'HIGH',   'Sewage discharge from Kampala suburbs',       ST_GeomFromText('POINT(32.5 0.0)', 4326),  'GPS',      'WEB_FORM', NOW() - INTERVAL '1 day'),
  ('hash011', 'VIC01', 'ENCROACHMENT',        'HIGH',   'Sand mining operation active',                ST_GeomFromText('POINT(32.3 0.2)', 4326),  'GPS',      'SMS',      NOW() - INTERVAL '4 days'),
  ('hash012', 'VIC01', 'FLOOD',               'MEDIUM', 'Shoreline flooding after heavy rains',        ST_GeomFromText('POINT(32.7 -0.1)', 4326), 'GPS',      'USSD',     NOW() - INTERVAL '6 days'),
  ('hash013', 'VIC01', 'VEGETATION_CHANGE',   'MEDIUM', 'Water hyacinth bloom spreading',              ST_GeomFromText('POINT(32.4 -0.3)', 4326), 'CENTROID', 'USSD',     NOW() - INTERVAL '9 days'),
  ('hash014', 'VIC01', 'WILDLIFE',            'LOW',    'Hippo movement near fishing village',         ST_GeomFromText('POINT(32.6 0.1)', 4326),  'GPS',      'SMS',      NOW() - INTERVAL '20 days'),

  -- ALB01 reports
  ('hash015', 'ALB01', 'ENCROACHMENT',        'HIGH',   'Oil exploration equipment on wetland',        ST_GeomFromText('POINT(31.0 2.0)', 4326),  'GPS',      'WEB_FORM', NOW() - INTERVAL '2 days'),
  ('hash016', 'ALB01', 'POLLUTION',           'MEDIUM', 'Fishing boat fuel leak',                      ST_GeomFromText('POINT(30.8 1.8)', 4326),  'GPS',      'SMS',      NOW() - INTERVAL '11 days'),
  ('hash017', 'ALB01', 'DROUGHT',             'HIGH',   'Extreme low water levels, fish dying',        ST_GeomFromText('POINT(31.2 2.2)', 4326),  'GPS',      'USSD',     NOW() - INTERVAL '14 days'),
  ('hash018', 'ALB01', 'VEGETATION_CHANGE',   'LOW',    'Acacia encroachment on northern bank',        ST_GeomFromText('POINT(30.9 2.1)', 4326),  'CENTROID', 'USSD',     NOW() - INTERVAL '18 days'),

  -- KAT01 reports
  ('hash019', 'KAT01', 'FLOOD',               'HIGH',   'Katonga River burst banks',                   ST_GeomFromText('POINT(31.5 0.0)', 4326),  'GPS',      'USSD',     NOW() - INTERVAL '3 days'),
  ('hash020', 'KAT01', 'ENCROACHMENT',        'MEDIUM', 'Sugarcane plantation expanding',              ST_GeomFromText('POINT(31.3 0.2)', 4326),  'GPS',      'SMS',      NOW() - INTERVAL '6 days'),
  ('hash021', 'KAT01', 'POLLUTION',           'MEDIUM', 'Agrochemical runoff detected',                ST_GeomFromText('POINT(31.7 -0.2)', 4326), 'GPS',      'WEB_FORM', NOW() - INTERVAL '13 days'),
  ('hash022', 'KAT01', 'VEGETATION_CHANGE',   'LOW',    'Papyrus regeneration after dry season',       ST_GeomFromText('POINT(31.4 0.1)', 4326),  'CENTROID', 'USSD',     NOW() - INTERVAL '22 days');
