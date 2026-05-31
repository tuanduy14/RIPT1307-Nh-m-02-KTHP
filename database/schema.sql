-- PostgreSQL schema for Club Equipment Borrowing system
-- Run this on your Render PostgreSQL database or locally with psql.

CREATE TYPE request_status AS ENUM ('pending', 'approved', 'returned', 'rejected');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE equipments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  equipment_id INT NOT NULL REFERENCES equipments(id),
  user_id INT NOT NULL REFERENCES users(id),
  amount INT NOT NULL CHECK (amount > 0),
  status request_status NOT NULL DEFAULT 'pending',
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_soon_notified_at TIMESTAMPTZ,
  overdue_notified_at TIMESTAMPTZ
);

CREATE INDEX idx_requests_equipment_id ON requests (equipment_id);
CREATE INDEX idx_requests_user_id ON requests (user_id);
CREATE INDEX idx_requests_status ON requests (status);
