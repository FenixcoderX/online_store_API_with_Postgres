CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(24) NOT NULL,
      "firstName" VARCHAR(24) NOT NULL, --Double quotes are used because firstName is a reserved keyword in SQL
      "lastName" VARCHAR(24) NOT NULL,  
      password_digest VARCHAR NOT NULL
);