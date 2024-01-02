<h1 align="center">
  📝 FischkApp API
  <br>
  <p align="center">
    <img src="./docs/fischkappLogo.png" alt="FischkApp Logo"/>
  </p>
</h1>
<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#features">Features</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-endpoints">API Endpoints</a> •
  <a href="#testing">Testing</a> 
</p>
<br><br><br>

## Introduction

The FischkApp API is a highly efficient and secure system for managing flashcards. Developed with Express.js, TypeScript, and MongoDB, it offers robust functionality for creating, updating, and managing flashcard data, making it a valuable tool for educational and learning platforms.
<br><br>

## Features

**· CRUD Operations**: Create, read, update, and delete flashcards.

**· Simple Security**: Implemented basic security checks for API access.

**· Automated Testing**: Extensive test suite using Jest and Supertest for robust API functionality.

**· CORS Management**: Configured to handle Cross-Origin Resource Sharing (CORS).

<br><br>

## Technologies

**· Express.js**

**· TypeScript**

**· MongoDB & Mongoose**

**· Jest & Supertest**

**· Swagger**

<br><br>

## Getting Started

**1. Clone the Repository**

```bash
https://github.com/wawrzonnn/fischkapp-api.git
```

**2. Set Up Environment Variables**

Create a **.env** file in the root directory of the project. You can use the **.env.example** file as a template. Fill in the values for the following variables:

```bash
ALLOWED_ORIGIN: The origin allowed to access the API, e.g., http://localhost:3000
MONGODB_URI: Your MongoDB connection string, e.g., mongodb://127.0.0.1:27017/yourdbname
PORT: The port on which the server will run, e.g., 4000
```

**3. Install Dependencies**

```bash
npm install
```

**4. Run the Application**

```bash
npm run start
```

The application will be running on **http://localhost:4000.**

<br><br>

## API Endpoints

```bash
POST /cards: Create a new flashcard.
GET /cards: Retrieve all flashcards.
PUT /cards/:id: Update a specific flashcard.
DELETE /cards/:id: Delete a specific flashcard.
```

<br><br>

## Testing 

Run the test suite to ensure the API functions correctly:

```bash
npm run test
```
<br><br>
