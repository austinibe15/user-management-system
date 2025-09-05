# user-management-system# User Management System with Authentication

## Description

This is a **User Management System** built with **Node.js**, **Express**, **MySQL**, and **React**. The system allows users to perform basic CRUD (Create, Read, Update, Delete) operations on user profiles. Additionally, user authentication is included for enhanced security. The application demonstrates how to connect a front-end React application with a back-end Node.js API and MySQL database.

## Features

- **User Authentication**: Secure login and registration functionality using JWT (JSON Web Tokens).
- **View Users**: Displays a list of users with their profiles (name, email, and age).
- **Add User**: Allows adding a new user by providing their details (name, email, age).
- **Update User**: Allows editing a user's profile information.
- **Delete User**: Deletes a user's profile from the database.
- **Responsive UI**: Built with React to ensure a smooth user experience across different devices.

## Tech Stack

### Backend:
- **Node.js** with **Express** for the server-side logic.
- **MySQL** for the relational database to store user data.
- **Cors** for enabling cross-origin requests.
- **Body-Parser** for parsing incoming request bodies.
- **JWT (JSON Web Token)** for implementing secure user authentication.
- **bcryptjs** for hashing passwords.

### Frontend:
- **React** for building the user interface.
- **Axios** for making HTTP requests from React to the backend API.
- **React Router** for handling routing between different views (e.g., add user, edit user, user list).
- **LocalStorage** for storing the authentication token on the client-side.

## Getting Started

### Prerequisites

- **Node.js** installed on your machine.
- **MySQL** installed and running.

### Backend Setup

1. Clone this repository:
   ```bash
   git clone <repository_url>
   cd user-management-backend
Install dependencies:

Copy
npm install
Create a MySQL database and a users table:

Copy
CREATE DATABASE user_management;
USE user_management;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  age INT NOT NULL
);
Update the server.js file with your MySQL database credentials (if needed).

Start the backend server:

Copy
node server.js
The backend should now be running on http://localhost:5000.

Frontend Setup
Navigate to the frontend directory:

Copy
cd user-management-frontend
Install dependencies:

Copy
npm install
Update the API endpoint in the frontend to match your backend URL (e.g., http://localhost:5000).

Start the frontend server:

Copy
npm start
The frontend should now be running on http://localhost:3000.

Authentication Flow
Register: New users can register by providing their name, email, password, and age. The password is securely hashed before storing in the database.
Login: Registered users can log in by providing their email and password. If successful, they will receive a JWT token, which should be stored in LocalStorage on the client-side.
Access Protected Routes: Once logged in, users can access protected routes (e.g., viewing, adding, editing, and deleting users) by attaching the JWT token to the Authorization header of their requests.
Usage
View Users: The homepage displays a list of all users. This feature is accessible only to authenticated users.
Add New User: Click the "Add New User" button to create a new user.
Edit User: Click the "Edit" button next to a user's name to update their profile.
Delete User: Click the "Delete" button next to a user's name to remove them from the database.
Authentication: Users must log in to access the system's user management features.
