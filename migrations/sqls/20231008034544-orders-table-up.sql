CREATE TABLE orders ( 
    id SERIAL PRIMARY KEY, 
    user_id integer REFERENCES users(id), 
    status VARCHAR(15) CHECK ("status" IN('active', 'complete')) NOT NULL DEFAULT 'active'
);