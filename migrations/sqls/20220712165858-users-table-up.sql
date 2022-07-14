CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username varchar NOT NULL UNIQUE,
  firstName varchar(64) NOT NULL,
  lastName varchar(64) NOT NULL,
  password varchar(100) NOT NULL
);