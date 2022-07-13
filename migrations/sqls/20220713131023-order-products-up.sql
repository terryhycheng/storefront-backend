CREATE TABLE order_producs (
  id SERIAL PRIMARY KEY,
  quantity int,
  order_id bigint REFERENCES orders (id),
  product_id bigint REFERENCES products (id)
);