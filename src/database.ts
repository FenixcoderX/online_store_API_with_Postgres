// This file is used to connect to the database and export the connection to other files

import dotenv from 'dotenv'; //Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
import { Pool } from 'pg';  //Pool is a class that represents a connection pool to a PostgreSQL database to be used by a Node.js application 

//Load the environment variables from the .env file into process.env
dotenv.config(); 
// Load environment variables from .env file
const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB,
  ENV,
} = process.env;

// Create a new connection pool to the database
export let Client:Pool; 
console.log('ENV dev or test:',ENV); 

// If the environment is set to test, connect to the test database
if (ENV === 'test') {
  Client = new Pool({ 
    host: POSTGRES_HOST,
    database: POSTGRES_TEST_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
}

// If the environment is set to dev, connect to the development database
if (ENV === 'dev') {
  Client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  });
}

