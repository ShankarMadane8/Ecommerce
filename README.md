# E-Commerce Application

## Overview

This repository contains the code for an E-Commerce application with both backend and frontend components. The backend is built with Spring Boot and handles business logic, database interactions, and OAuth authentication. The frontend is developed using React and provides the user interface.


## Table of Contents
1. [Backend](#backend)
2. [Frontend](#frontend)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Entities](#entities)
7. [Endpoints](#endpoints)
8. [OAuth Integration](#oauth-integration)
9. [Contributing](#contributing)
10. [License](#license)

## Backend

The backend is developed using Spring Boot and provides RESTful APIs for the e-commerce application. It includes user authentication, product management, cart functionality, order processing, and more.

### Features
- User authentication with JWT
- Product CRUD operations
- Category management
- Order processing
- Cart management
- Address management
- Role-based access control

### Technologies Used
- Java 17
- Spring Boot
- Hibernate
- MySQL
- Swagger OpenAPI





## OAuth Integration

### GitHub
**Getting Client ID and Secret Key:**

1. **Register a New Application:**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers).
   - Click on "New OAuth App."
   - Fill out the application details:
     - **Application Name:** Your App Name
     - **Homepage URL:** Your App's URL
     - **Authorization Callback URL:** The URL to which GitHub will redirect after authentication (e.g., `http://localhost:3000/auth/github/callback`).

2. **Retrieve Client ID and Secret Key:**
   - After registration, you will be provided with a **Client ID** and **Client Secret**. Copy these values.



### Facebook


 **Setting in Backend:**

1. **Open `src/main/java/controller/AuthController.java`** or your application configuration file where OAuth credentials are set.

2. **GitHub:**
   - Search for `clientId` and `clientSecret` in the `AuthController` class or your application configuration.
   - Set the GitHub Client ID and Secret Key in the `AuthController` class:

     ```java
     // GitHub OAuth configuration
     private static final String GITHUB_CLIENT_ID = "your-github-client-id";
     private static final String GITHUB_CLIENT_SECRET = "your-github-client-secret";
     ```

3. **Facebook:**
   - Similarly, search for `clientId` and `clientSecret` in the `AuthController` class or your application configuration.
   - Set the Facebook Client ID and Secret Key:

     ```java
     // Facebook OAuth configuration
     private static final String FACEBOOK_CLIENT_ID = "your-facebook-client-id";
     private static final String FACEBOOK_CLIENT_SECRET = "your-facebook-client-secret";
     ```

**Setting in Frontend:**

1. **Open your `LoginPage` component** or the file where OAuth buttons are configured.

2. **GitHub:**
   - Locate the GitHub OAuth configuration in your component, typically where you set the `authorizeUrl` and `clientId`.
   - Set the GitHub Client ID:

     ```jsx
     <OauthSender
       authorizeUrl="https://github.com/login/oauth/authorize"
       clientId="your-github-client-id"
       redirectUri="http://localhost:3000/login?provider=github"
       render={({ url }) => (
         <a href={url} className="btn btn-dark btn-github">
           <FaGithub /> Login with GitHub
         </a>
       )}
     />
     ```

3. **Facebook:**
   - Similarly, locate the Facebook OAuth configuration.
   - Set the Facebook Client ID:

     ```jsx
     <OauthSender
       authorizeUrl="https://www.facebook.com/v13.0/dialog/oauth"
       clientId="your-facebook-client-id"
       redirectUri="http://localhost:3000/login?provider=facebook"
       scope="public_profile,email"
       render={({ url }) => (
         <a href={url} className="btn btn-primary btn-facebook">
           <FaFacebook /> Login with Facebook
         </a>
       )}
     />
     ```

4. **Ensure that the `authorizeUrl` and `redirectUri` are set correctly** for both GitHub and Facebook OAuth flows.

Replace `your-github-client-id` and `your-facebook-client-id` with the actual values you obtained from the respective OAuth provider's developer portal.

Make sure to include any additional configuration, such as scopes or redirect URIs, as required by your OAuth provider.


4. **Ensure that your `AuthController` class uses these credentials** when making OAuth requests. For example, when exchanging authorization codes for access tokens or fetching user details.

Replace `your-github-client-id`, `your-github-client-secret`, `your-facebook-client-id`, and `your-facebook-client-secret` with the actual values you obtained from the respective OAuth provider's developer portal.


### How OAuth Works in the Application
1. **User Initiates Authorization:** User attempts to log in using GitHub or Facebook.
2. **Redirect to OAuth Provider:** User is redirected to the OAuth provider’s login page.
3. **Grant Permissions:** User logs in and authorizes the application.
4. **Receive Authorization Code:** Provider redirects back with an authorization code.
5. **Token Exchange:** Application exchanges the code for an access token.
6. **Fetch User Data:** Application uses the token to fetch user information.
7. **Generate JWT Token:** Application generates a JWT token for user sessions.

## Installation

### Prerequisites
- Java 17
- MySQL
- Node.js and npm

### Backend Setup
  ## Default User Credentials

   For initial setup, you can use the following default user credentials:

   - **Email:** admin@gmail.com
   - **Password:** admin123

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/gajanan-kharat/java-ecommerce-microservice.git
   cd Ecommerce_backend
   mvn clean install
   mvn spring-boot:run

### Frontend Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/gajanan-kharat/java-ecommerce-microservice.git
   cd Ecommerce_frontend
   npm install
   npm start
