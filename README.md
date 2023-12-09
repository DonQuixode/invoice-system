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

## Database Schema Design

1. **Tables**

    1. users: to store admin payer and reciever data
    2. invoice: to store all the initiated invoices data
    3. payments: to store all the completed payments data by payer

2. **Schema**



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


