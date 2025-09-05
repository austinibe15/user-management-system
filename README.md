<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
# User Management System with Authentication

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
>>>>>>> b86ecd3c1c594af38e118150321bb85321fe1200
