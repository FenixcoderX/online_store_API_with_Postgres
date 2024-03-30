// Define user model: classes and its methods to interact with the database

import bcrypt from 'bcrypt';

import { Client } from '../database';

// Define properties of user types to be used in the UserStore class
export type User = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

// extends User
export type UserWithID = User & { 
  id: number;
};

// Destructure the BCRYPT_PASSWORD and SALT_ROUNDS from the process.env object and assign them to the pepper and saltRounds variables
const { BCRYPT_PASSWORD: pepper, SALT_ROUNDS: saltRounds } = process.env;

/**
 * Class that interacts with the database to perform CRUD operations on users, contains following methods:
 */
export class UserStore {

  /**
   * Shows all users from the user table of the database
   *
   * @returns {Promise<UserWithID[]>} An array of user objects
   */
  async index(): Promise<UserWithID[]> {
    try {
      const sql = 'SELECT * FROM users';
      // Connect to the database
      const conn = await Client.connect();
      // Execute the query and store the result in a result variable
      const result = await conn.query(sql);
      // Disconnect from the database
      conn.release();
      // Return the rows from the result
      return result.rows;
   
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  /**
   * Shows a specific user from the user table of the database
   *
   * @param {string} id - The ID of the user to show
   * @returns {Promise<UserWithID>} The user object with the provided ID
   */
  async show(id: string): Promise<UserWithID> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get user by ${id}. Error: ${err}`);
    }
  }

  /**
   * Creates a new user in the user table of the database
   *
   * @param {User} u - The user object to create
   * @returns {Promise<UserWithID>} The created user object
   */
  async create(u: User): Promise<UserWithID> {
    try {
      // Check if the user already exists in the database before creating a new user to avoid duplicates and throw an error if they do
      const sql = 'SELECT * FROM users WHERE username=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [u.username]);
      conn.release();
      if (result.rows.length) {
        throw new Error(`User with username (${u.username}) already exists.`);
      }
    } catch (err) {
      throw new Error(`Could not create user (${u.username}) when checking if user already exists. Error: ${err}`);
    }
//
    try {
      // Add the user to the database
      const sql2 = 'INSERT INTO users (username, "firstName", "lastName", password_digest) VALUES($1, $2, $3, $4) RETURNING *';
      
      // Create a hash of the password for a new user to store in the database
      const hash = bcrypt.hashSync(u.password + pepper, Number(saltRounds));

      const conn = await Client.connect();
      const result2 = await conn.query(sql2, [u.username, u.firstName, u.lastName, hash]);
      const user = result2.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Could not create user (${u.username}) when adding user to the database. Error: ${err}`);
    }
  }

  /**
   * Authenticates a user in the user table of the database with the provided username and password
   * 
   * @param {string} username - The username of the user to authenticate
   * @param {string} password - The password of the user to authenticate
   * @returns {Promise<UserWithID | null>} The authenticated user object, or null if authentication fails
   */
  async authenticate(username: string, password: string): Promise<UserWithID | null> {
    try {
      const sql = 'SELECT * FROM users WHERE username=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [username]);
      conn.release();

      // Check if the user exists in the database
      if (result.rows.length) {
        const user = result.rows[0];
        console.log(result.rows[0]);

        // Check if the password provided matches the hashed password in the database
        if (bcrypt.compareSync(password + pepper, user.password_digest)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`Could not authenticate user (${username}). Error: ${err}`);
    }
  }

  /**
   * Updates a user in the user table of the database
   * 
   * @param {UserWithID} u - The user object to update
   * @returns {Promise<UserWithID>} The updated user object
   */
  async update(u: UserWithID): Promise<UserWithID> {
    try {
      const sql = 'UPDATE users SET username=$2, "firstName"=$3, "lastName"=$4, password_digest=$5 WHERE id=$1 RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [u.id, u.username, u.firstName, u.lastName, u.password]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Could not update user ${u.username}. Error: ${err}`);
    }
  }

  /**
   * Deletes a user from the user table of the database
   * 
   * @param {string} id - The ID of the user to delete
   * @returns {Promise<UserWithID>} The deleted user object
   */
  async delete(id: string): Promise<UserWithID> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
}
