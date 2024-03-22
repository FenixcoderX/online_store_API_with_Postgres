CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(24) NOT NULL,
      "firstName" VARCHAR(24) NOT NULL,
      "lastName" VARCHAR(24) NOT NULL,
      password_digest VARCHAR NOT NULL
);