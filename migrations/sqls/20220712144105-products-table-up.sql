CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name varchar NOT NULL UNIQUE,
  price int NOT NULL,
  category varchar(15) 
);