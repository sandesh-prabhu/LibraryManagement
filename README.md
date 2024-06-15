# Library Management

This project is a Node.js application with MongoDB as the database. It provides RESTful APIs for managing books, users, and borrowing transactions.

## Setup Instructions

### Prerequisites

- Node.js and npm (or yarn) installed on your system. You can download them from the official Node.js website: https://nodejs.org/en
- MongoDB installed locally or accessible via a MongoDB Atlas cluster. You can create a free account at: https://www.mongodb.com/products/platform/cloud
- Git installed on your machine (optional)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sandesh-prabhu/LibraryManagement.git
   ```

   Or download the ZIP file and extract it.

2. Navigate to the project directory:

   ```bash
   cd LibraryManagement
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Add Environment Variables

   Create a `.env` file in the root directory of the project with the following environment variables:

   ```bash
   PORT = 8000
   MONGO_URI = <MongoDB_url>
   SALT_ROUNDS = <any_integer_from_5_to_9>
   ACCESS_TOKEN_SECRET = <secret_access_string>
   REFRESH_TOKEN_SECRET = <secret_refresh_string>
   ```

5. Start the server:

   ```bash
   npm start
   ```

   This will start the server on `http://localhost:8000` by default.

## API Documentation

    The root folder contains the postman documentation file(LibraryManagement.postman_collection.json).
