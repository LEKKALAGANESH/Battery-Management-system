-- Seed demo users with roles
INSERT INTO users (email, password_hash, role)
VALUES
  ('demo@bms.dev', '$2a$10$G5x3m2g8mQh0E7cN3yWqHe9cPqHkA7Yq1Qup0pGvFqkq1w6Zp2m2i', 'user'),
  ('admin@bms.dev', '$2a$10$G5x3m2g8mQh0E7cN3yWqHe9cPqHkA7Yq1Qup0pGvFqkq1w6Zp2m2i', 'admin'),
  ('user1@bms.dev', '$2a$10$G5x3m2g8mQh0E7cN3yWqHe9cPqHkA7Yq1Qup0pGvFqkq1w6Zp2m2i', 'user'),
  ('user2@bms.dev', '$2a$10$G5x3m2g8mQh0E7cN3yWqHe9cPqHkA7Yq1Qup0pGvFqkq1w6Zp2m2i', 'user'),
  ('manager@bms.dev', '$2a$10$G5x3m2g8mQh0E7cN3yWqHe9cPqHkA7Yq1Qup0pGvFqkq1w6Zp2m2i', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed sample readings for multiple batteries
-- Battery 1001: Recent data (last 3 hours)
INSERT INTO battery_readings (battery_id, current, voltage, temperature, time)
SELECT '1001',
       10 + random()*5,
       48 + random()*2,
       30 + random()*5,
       now() - (INTERVAL '1 minute' * g)
FROM generate_series(0, 180) AS g;

-- Battery 1002: Recent data (last 2 hours)
INSERT INTO battery_readings (battery_id, current, voltage, temperature, time)
SELECT '1002',
       8 + random()*6,
       47 + random()*3,
       28 + random()*7,
       now() - (INTERVAL '1 minute' * g)
FROM generate_series(0, 120) AS g;

-- Battery 1003: Recent data (last 4 hours)
INSERT INTO battery_readings (battery_id, current, voltage, temperature, time)
SELECT '1003',
       12 + random()*4,
       49 + random()*1.5,
       32 + random()*3,
       now() - (INTERVAL '1 minute' * g)
FROM generate_series(0, 240) AS g;

-- Battery 2001: Historical data (last 24 hours)
INSERT INTO battery_readings (battery_id, current, voltage, temperature, time)
SELECT '2001',
       9 + random()*4,
       47.5 + random()*2.5,
       29 + random()*6,
       now() - (INTERVAL '1 minute' * g)
FROM generate_series(0, 1440) AS g;

-- Battery 2002: Historical data (last 12 hours)
INSERT INTO battery_readings (battery_id, current, voltage, temperature, time)
SELECT '2002',
       11 + random()*3,
       48.2 + random()*1.8,
       31 + random()*4,
       now() - (INTERVAL '1 minute' * g)
FROM generate_series(0, 720) AS g;

-- Battery 3001: Mixed data with some anomalies (last 6 hours)
INSERT INTO battery_readings (battery_id, current, voltage, temperature, time)
SELECT '3001',
       CASE WHEN random() < 0.1 THEN 25 + random()*10 ELSE 10 + random()*5 END, -- Occasional high current
       CASE WHEN random() < 0.05 THEN 45 + random()*5 ELSE 48 + random()*2 END, -- Occasional low voltage
       CASE WHEN random() < 0.08 THEN 40 + random()*10 ELSE 30 + random()*5 END, -- Occasional high temp
       now() - (INTERVAL '1 minute' * g)
FROM generate_series(0, 360) AS g;

-- Battery 4001: Consistent data (last 1 hour - high frequency)
INSERT INTO battery_readings (battery_id, current, voltage, temperature, time)
SELECT '4001',
       10.5 + sin(g::float/10)*2, -- Sine wave pattern
       48.5 + cos(g::float/15)*1,
       30 + sin(g::float/20)*3,
       now() - (INTERVAL '10 seconds' * g)
FROM generate_series(0, 360) AS g;
