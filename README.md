# Online Store API with Postgres

PostgreSQL | Node/Express | dotenv | db-migrate | jsonwebtoken | jasmine | TypeScript | Supertest | bcrypt | CORS

A RESTful API has been developed to support the online store application, containing a Database SQL schema intended for use by frontend developers. It includes authentication, required endpoints, and data types for users, products, orders, and consolidated tables within the database.


## Instructions

### 1. **ENV**

In repo, you will see a `.env-example` file. Rename the file to `.env`. All variables already configured

### 2. **Install Docker on your computer and create database**

After Docker have been installed use this command in terminal in the project directory

```bash
  docker-compose up
```

### 3. **Install the dependencies**

```bash
  yarn install
```

The dependencies include Postgres, Node/Express, dotenv, db-migrate, jsonwebtoken, jasmine
and also TypeScript, Supertest, bcrypt, cors.

### 4. **Database setup**

Open psql and write this commands:
```bash
      CREATE USER full_stack_user WITH PASSWORD 'password123';
      CREATE DATABASE full_stack_dev;
      CREATE DATABASE full_stack_test;
      \c full_stack_dev
      GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user;
      GRANT ALL ON SCHEMA public TO full_stack_user;
      \c full_stack_test
      GRANT ALL PRIVILEGES ON DATABASE full_stack_test TO full_stack_user;
      GRANT ALL ON SCHEMA public TO full_stack_user;
```
### 5. **Run migrations**

```bash
  yarn migrate
  or
  db-migrate up
```

### 6. Now you can **use the following scripts**:

```bash
  yarn test
  or 
  yarn testAndMigrate
```
```bash
  yarn watch
```

- test: to test models and handlers
- watch: to start the server

### 7. **You can use Postman to interact with database through API Endpoints**

Example of GET request: http://localhost:3000/products


## API Endpoints

### Products

| Function | Description | Method | Endpoint | Token required| 
| - | - | - | - | - |
| create | create a new product | POST | /products | Yes |
| index | show all products | GET | /products | No |
| show | show a specific product | GET | /products/:id | No |
| indexByCategory | show products by specific category | GET | /products/category/:category | No |
| update | update a product | PUT | /products/:id | Yes |
| del | delete a product | DELETE | /products/:id | Yes |

### Users

| Function | Description | Method | Endpoint | Token required| 
| - | - | - | - | - |
| create | create a new user | POST | /users | No |
| authenticate | authenticate a user | POST | /users/authenticate | No |
| index | show all users | GET | /users | Yes |
| show | show a specific user | GET | /users/:id | Yes |
| update | update a user | PUT | /users/:id | Yes |
| del | delete a user | DELETE | /users/:id | Yes |

### Orders

| Function | Description | Method | Endpoint | Token required| 
| - | - | - | - | - |
| create | create a new order | POST | /orders | Yes |
| index | show all orders | GET | /orders | Yes |
| show | show a specific order | GET | /orders/:id | Yes |
| currentOrder | show current (active) order by specific user | GET | /orders/current/:id | Yes |
| addProduct | add a product to a specific order | POST | /orders/:order_id/products | Yes |
| deleteProduct | delete a product from a specific order | DELETE | /orders/:order_id/products | Yes |
| update | update an order | PUT | /orders/:id | Yes |
| completedOrders | show completed orders by specific user | GET | /orders/completed/:id | Yes |
| del | delete an order | DELETE | /orders/:id | Yes |

### Dashboard

| Function | Description | Method | Endpoint | Token required| 
| - | - | - | - | - |
| productsInOrders | show all products included in orders | GET | /products_in_orders | Yes |
| usersWithOrders | show all users who have made orders  | GET | /users-with-orders | Yes |
| fiveMostExpensive | show 5 most expensive products | GET | /five-most-expensive | No |
| fiveMostPopular | show 5 most popular products | GET | /five-most-popular | No |

## Data Shapes

### Product

| id | name | price | category|
| - | - | - | - |
| number | string | number | string |


### User

| id | userName | firstName | lastName | password |
| - | - | - | - | - |
| number | string | string | string | string |

### Order

| id | user_id | status |
| - | - | - |
| number | number | string - "active" or "complete" |

### Order_Product

| id | order_id | product_id | quantity |
| - | - | - | - |
| number | number | number | number |