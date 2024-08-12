# Asset Trading Tracker

## Overview
This project is an Asset Trading Tracker application where users can create, manage, and trade assets. The application supports user authentication, asset management, and a marketplace for buying and selling assets. It features a negotiation process for trading assets and provides detailed asset history and statistics.

## Features
- User authentication (signup and login) with JWT.
- Asset management: create, update, list, and manage assets.
- Marketplace functionality: list assets, make purchase requests, and negotiate prices.
- Detailed asset information including trading history, average trading price, last trading price, and more.

## API Endpoints

### User Authentication

1. **User Signup**
   - **Endpoint:** `POST /auth/signup`
   - **Request:**
     ```json
     {
       "username": "string",
       "password": "string",
       "email": "string"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "User created successfully",
       "token": "jwt_token"
     }
     ```

2. **User Login**
   - **Endpoint:** `POST /auth/login`
   - **Request:**
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Login successful",
       "token": "jwt_token"
     }
     ```

### Asset Management

1. **Create Asset / Save as Draft**
   - **Endpoint:** `POST /assets`
   - **Request:**
     ```json
     {
       "name": "string",
       "description": "string",
       "image": "string",
       "status": "draft" // or "published"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Asset created successfully",
       "assetId": "string"
     }
     ```

2. **Update Asset**
   - **Endpoint:** `POST /assets/:id`
   - **Request:**
     ```json
     {
       "name": "string",
       "description": "string",
       "image": "string",
       "status": "draft" // or "published"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Asset updated successfully",
       "assetId": "string"
     }
     ```

3. **List Asset on Marketplace**
   - **Endpoint:** `PUT /assets/:id/publish`
   - **Response:**
     ```json
     {
       "message": "Asset published successfully"
     }
     ```

4. **Get Asset Details**
   - **Endpoint:** `GET /assets/:id`
   - **Response:**
     ```json
     {
       "id": "string",
       "name": "string",
       "description": "string",
       "image": "string",
       "creator": "string",
       "currentHolder": "string",
       "tradingJourney": [
         {
           "holder": "string",
           "date": "date",
           "price": "number"
         }
       ],
       "averageTradingPrice": "number",
       "lastTradingPrice": "number",
       "numberOfTransfers": "number",
       "isListed": "boolean",
       "proposals": "number"
     }
     ```

5. **Get User's Assets**
   - **Endpoint:** `GET /users/:id/assets`
   - **Response:**
     ```json
     [
       {
         "id": "string",
         "name": "string",
         "description": "string",
         "image": "string",
         "currentHolder": "string",
         "tradingJourney": [
           {
             "holder": "string",
             "date": "date",
             "price": "number"
           }
         ],
         "averageTradingPrice": "number",
         "lastTradingPrice": "number",
         "numberOfTransfers": "number",
         "isListed": "boolean",
         "proposals": "number"
       }
     ]
     ```

### Marketplace and Trading

1. **Get Assets on Marketplace**
   - **Endpoint:** `GET /marketplace/assets`
   - **Response:**
     ```json
     [
       {
         "id": "string",
         "name": "string",
         "description": "string",
         "image": "string",
         "currentHolder": "string",
         "price": "number",
         "proposals": "number"
       }
     ]
     ```

2. **Request to Buy an Asset**
   - **Endpoint:** `POST /assets/:id/request`
   - **Request:**
     ```json
     {
       "proposedPrice": "number"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Purchase request sent"
     }
     ```

3. **Negotiate Purchase Request**
   - **Endpoint:** `PUT /requests/:id/negotiate`
   - **Request:**
     ```json
     {
       "newProposedPrice": "number"
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Negotiation updated"
     }
     ```

4. **Accept Purchase Request**
   - **Endpoint:** `PUT /requests/:id/accept`
   - **Response:**
     ```json
     {
       "message": "Request accepted, holder updated"
     }
     ```

5. **Deny Purchase Request**
   - **Endpoint:** `PUT /requests/:id/deny`
   - **Response:**
     ```json
     {
       "message": "Request denied"
     }
     ```

6. **Get User's Purchase Requests**
   - **Endpoint:** `GET /users/:id/requests`
   - **Response:**
     ```json
     [
       {
         "requestId": "string",
         "assetId": "string",
         "proposedPrice": "number",
         "status": "pending" // or "accepted", "denied"
       }
     ]
     ```

## Testing

To ensure functionality, tests are provided for:
- User Signup and Login
- Asset Management
- Marketplace and Trading

## Setup and Installation

1. **Clone the repository:**
Navigate to the project directory:

cd <project-directory>
Install dependencies:

npm install
Start the server:

npm start
