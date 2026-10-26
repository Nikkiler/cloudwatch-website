CREATE TABLE alarms (
  alarm_ID  SERIAL PRIMARY KEY,
  name text NOT NULL UNIQUE,
  display_Status boolean NOT NULL
);