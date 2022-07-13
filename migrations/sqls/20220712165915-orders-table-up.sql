CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id int REFERENCES users (id) NOT NULL,
  status varchar(20)
);