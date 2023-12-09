# Invoice System

This is a simple invoice system that requires configuration files for the application (`app-config.js`) and the database (`db-config.js`). Follow the instructions below to set up the system.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/shadanxd/invoice-system.git
    cd invoice-system
    ```

2. **Create configuration files inside the `app/config` directory:**

    - `app-config.js` for application configuration.
    
        Example `app/config/app-config.js`:
        ```javascript
        module.exports ={
        session_key : "123456789123456789",
        port: 3000
        };
        
        ```

    - `db-config.js` for database configuration.
    
        Example `app/config/db-config.js`:
        ```javascript
        module.exports = {
          // format
          HOST: "localhost",
          USER: "postgres",
          PASSWORD: "123456",
          DB: "invoice_service", 
          PORT: 5432
        };
        ```

3. **Install dependencies using npm:**

    ```bash
    npm install
    ```

4. **Run the node server:**

    ```bash
    node index.js
    ```

# Database Schema

## Users Table

### Columns

- `user_id`: SERIAL PRIMARY KEY - Unique identifier for each user.
- `name`: VARCHAR(255) NOT NULL - Name of the user.
- `address`: VARCHAR(255) NOT NULL - Address of the user.
- `role`: VARCHAR(10)  NOT NULL CHECK (role IN ('admin', 'payer', 'receiver')) - Role of the user. Can be 'admin', 'payer', or 'receiver'.
- `username`: VARCHAR(255) NOT NULL - username of the user
- `password`: VARCHAR(255) NOT NULL - password of the user

### Constraints

- The `user_id` is the primary key, ensuring each user has a unique identifier.
- `name`, `address`, `username`, `password`, `address`, `role` cannot be NULL.
- `role` must be one of 'admin', 'payer', or 'receiver'.

## Invoices Table

### Columns

- `invoice_id`: SERIAL PRIMARY KEY - Unique identifier for each invoice.
- `payer_id`: INTEGER NOT NULL - Foreign key referencing the user_id of the payer.
- `receiver_id`: INTEGER NOT NULL - Foreign key referencing the user_id of the receiver.
- `initiation_date`: DATE NOT NULL - Date when the invoice was initiated.
- `due_date`: DATE NOT NULL - Due date for the invoice.
- `amount`: DECIMAL(10, 2) NOT NULL - Amount of the invoice.
- `status`: VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'REJECTED')) DEFAULT 'PENDING' - Status of the invoice.
- `description`: TEXT - Additional description for the invoice.

### Constraints

- The `invoice_id` is the primary key, ensuring each invoice has a unique identifier.
- `payer_id` and `receiver_id` are foreign keys referencing the `user_id` in the `users` table.
- `status` must be one of 'PENDING', 'COMPLETED', or 'REJECTED'.
- The default status is 'PENDING'.
- The payer and receiver roles are enforced through CHECK constraints.

## Payments Table

### Columns

- `payment_id`: SERIAL PRIMARY KEY - Unique identifier for each payment.
- `invoice_id`: INTEGER NOT NULL - Foreign key referencing the invoice_id.
- `payer_id`: INTEGER NOT NULL - Foreign key referencing the user_id of the payer.
- `mode`: VARCHAR(10) NOT NULL CHECK (mode IN ('offline', 'online')) - Payment mode, can be 'offline' or 'online'.
- `date`: DATE - Date when the payment was made.
- `amount`: DECIMAL(10, 2) NOT NULL - Amount of the payment.

### Constraints

- The `payment_id` is the primary key, ensuring each payment has a unique identifier.
- `invoice_id` is a foreign key referencing the `invoice_id` in the `invoices` table.




# Invoice Service API Documentation

## Introduction

The Invoice Service API provides endpoints to manage users, invoices, and payments within an invoicing system. This documentation outlines the available endpoints, their functionalities, and the expected request and response formats.

**Base URL:** `http://localhost:3000/invoice-system`

## Authentication

To access protected endpoints, provide the following headers in your requests:

- **username:** username of admin/payer/receiver
- **password:** corresponding password

## Authorisation

### All `/user` based endpoints accessed only by admin who is superuser

### Payment based endpoints:
- `/payment/add` only by payer and admin
- `/payment/fetch` only by admin
- `/payment/delete` only by admin

### Invoice based endpoints:
- `/invoice/add` only by receiver and admin
- `/invoice/fetch` only by receiver and admin
- `/invoice/delete` only by admin
`/invoice/updateStatus` only by admin

## Endpoints

### 1. Add User

- **Endpoint:** `/user/add`
- **Method:** POST
- **Request Body:**
  ```json
  {
      "name": "user11",
      "address": "lol",
      "role": "receiver",
      "username": "user11",
      "password": "12345"
  }


## Add Invoice

### Endpoint

- **Method:** POST
- **URL:** `http://localhost:3000/invoice-system/invoice/add`

### Request

- **Body:**
  - **Mode:** Raw
  - **Content-Type:** application/json
  - **Raw Data:**
    ```json
    {
        "user_id": 1,
        "payer_id": 2,
        "receiver_id": 3,
        "initiation_date": "08/12/2023",
        "due_date": "10/12/2023",
        "amount": 352
    }
    ```



## Add Payment

### Endpoint

- **Method:** POST
- **URL:** `http://localhost:3000/invoice-system/payment/add`

### Request

- **Body:**
  - **Mode:** Raw
  - **Content-Type:** application/json
  - **Raw Data:**
    ```json
    {
        "invoice_id": 5,
        "payer_id": 2,
        "mode": "online",
        "amount": 352
    }
    ```


## Fetch Users

### Endpoint

- **Method:** GET
- **URL:** `http://localhost:3000/invoice-system/user/fetch`

### Request

- **Allowed any of Query Parameters:**
  - `name`: "user2"
  - `userIdToCheck`: 2
  - `address`: "lol"
  - `username`: "user2"
  - `role`: "admin"


## Fetch Invoice

### Endpoint

- **Method:** GET
- **URL:** `http://localhost:3000/invoice-system/invoice/fetch`

### Request

- **Allowed any of Query Parameters:**
  - `status`: "PENDING" or "COMPLETED" or "REJECTED"
   - `amount`: 2000
  - `invoice_id`: 1
  - `payer_id`: 2
  - `receiver_id`: 3
   - `due_date`: "DD/MM/YYYY"
  - `initiation_date`: "DD/MM/YYYY"

## Fetch Payments

### Endpoint

- **Method:** GET
- **URL:** `http://localhost:3000/invoice-system/payment/fetch`

### Request

- **Allowed Query Parameters:**
  - `mode`: "online"
   - `payment_id`: 2
  - `invoice_id`: 10
  - `payer_id`: 9
  - `date`: "DD/MM/YYYY"
  - `amount`: 3000



## Update User

### Endpoint

- **Method:** PUT
- **URL:** `http://localhost:3000/invoice-system/user/update`

### Request

- **Body:**
  - **Mode:** Raw
  - **Content-Type:** application/json
  - **Raw Data:**
    ```json
    {   
        //user_id required all other paramters optional
        "user_id": 11,
        "username": "user2",
        "password": "1234",
        "name": "newuser",
        "role": "payer",
        "address": "check"
    }
    ```


## Update Invoice Status

### Endpoint

- **Method:** PUT
- **URL:** `http://localhost:3000/invoice-system/invoice/updateStatus`

### Request

- **Query Parameters:**
  - `invoice_id`: 11
  - `status`: "PENDING" or "COMPLETED" or "REJECTED"


## Delete User

### Endpoint

- **Method:** DELETE
- **URL:** `http://localhost:3000/invoice-system/user/delete`

### Request

- **Query Parameters:**
  - `user_id`: 13


## Delete Payment

### Endpoint

- **Method:** DELETE
- **URL:** `http://localhost:3000/invoice-system/payment/delete`

### Request

- **Query Parameters:**
  - `payment_id`: 5


## Delete Invoice

### Endpoint

- **Method:** DELETE
- **URL:** `http://localhost:3000/invoice-system/invoice/delete`

### Request

- **Query Parameters:**
  - `invoice_id`: 1


