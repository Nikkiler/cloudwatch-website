CREATE TABLE alarms (
  alarm_ID  SERIAL PRIMARY KEY,
  name text NOT NULL,
  display_Status boolean NOT NULL,
);