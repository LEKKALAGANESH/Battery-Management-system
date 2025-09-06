-- Schema for BMS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS battery_readings (
  id BIGSERIAL PRIMARY KEY,
  battery_id TEXT NOT NULL,
  current DOUBLE PRECISION NOT NULL,
  voltage DOUBLE PRECISION NOT NULL,
  temperature DOUBLE PRECISION NOT NULL,
  time TIMESTAMPTZ NOT NULL
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_battery_time ON battery_readings (battery_id, time DESC);
CREATE INDEX IF NOT EXISTS idx_battery_field_time ON battery_readings (battery_id, time);

