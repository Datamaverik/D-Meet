# **D-Meet App**

Welcome to the D-Meet app, a sophisticated video conferencing application built with the MERN stack and TypeScript. This app leverages modern technologies to offer seamless video calling, chat functionality, and robust user authentication.

## **Table of Contents**

- [**D-Meet App**](#d-meet-app)
  - [**Table of Contents**](#table-of-contents)
  - [**Project Overview**](#project-overview)
  - [**Features**](#features)
  - [**Tech Stack**](#tech-stack)
  - [**Setup and Installation**](#setup-and-installation)
  - [**Usage**](#usage)
  - [**OAuth 2.0 Integration**](#oauth-20-integration)
  - [**How It Works**](#how-it-works)
  - [**Screenshots**](#screenshots)

## **Project Overview**

The Video Meet App is a powerful video conferencing solution that allows users to create rooms, join rooms, and interact via video calls and chat. Built using a rich tech stack, the app provides a robust and scalable solution for virtual meetings.

## **Features**

- **User Authentication:** Secure login and logout with GitHub OAuth 2.0 integration.
- **Room Management:** Create and join rooms with unique IDs.
- **WebRTC Integration:** Establish peer-to-peer connections for video calls.
- **Real-Time Communication:** Use Socket.IO for real-time chat and connection management.
- **Robust Validation:** Four levels of validation implemented for both frontend and backend.

## **Tech Stack**

- **Frontend:**
  <img src="Readme-assets/react.png" height="30" width="30" alt="React-logo"> React, <img src="Readme-assets/Typescript.png" height="30" width="30" alt="typescript-logo">TypeScript,<img src="Readme-assets/chakra.png" height="30" width="30" alt="charka-logo"> Chakra UI,
- **Backend:** <img src="Readme-assets/nodeJS.svg" height="30" width="30" alt="nodeJS-logo"> Node.js,<img src="Readme-assets/Express.png" height="30" width="30" alt="express-logo"> Express,
  <img src="Readme-assets/Typescript.png" height="30" width="30" alt="Typescript-logo"> TypeScript
- **Database:** <img src="Readme-assets/mongo.png" height="30" width="30" alt="MongoDB-logo"> MongoDB,
- **Authentication:** <img src="Readme-assets/oauth.png" height="30" width="30" alt="OAuth2.0-logo"> OAuth2.0, <img src="Readme-assets/git.png" height="30" width="30" alt="GitHub_Login-logo"> GitHub Login
- **Real-Time Communication:** <img src="Readme-assets/socket.svg" height="30" width="30" alt="Socket-logo"> Socket.IO, <img src="Readme-assets/webRTC.svg" height="30" width="30" alt="WebRTC-logo"> WebRTC
- **Validation:** <img src="Readme-assets/zod.svg" height="30" width="30" alt="Zod-logo"> Zod, <img src="Readme-assets/joi.png" height="30" width="30" alt="Joi-logo"> Joi, Joi Password Complexity

## **Setup and Installation**

To get started with the Video Meet App, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Datamaverik/D-Meet
   ```
2. **Navigate to the Project Directory**

```bash
cd D-Meet-App
```

3. **Install Dependencies**
   ```bash
   npm install
   ```
4. **Set Up Environment Variables**
   Create a `.env` file in the root directory of `Server` and add the necessary environment variable. Refer to `.env.example` for required variables.
5. **Start the Application**
   ```bash
   cd Server
   npm start
   ```
   Opent a new terminal in the root directory
   ```bash
   cd Client
   npm run dev
   ```
6. **Access the App:**
   Open your browser and navigate to `http:localhost:5173`.

## **Usage**

- **Login:** Use your GitHub account to log in.
- **Create Room:** Generate a unique ID and share it with other.
- **Join Room:** Enter the room ID to join an existing room.
- **Video Call:** Connect with others in the room using WebRTC.
- **Chat** Send and recieve real-time messages in the chat window.

## **OAuth 2.0 Integration**

We’ve integrated GitHub OAuth 2.0 for seamless user authentication. Users can log in using their GitHub credentials, enhancing security and user experience.

## **How It Works**

1. **User Authentication:** User login via GitHub OAuth 2.0 or normal register themselves to the MongoDB
2. **Room Creation:** Users create or join rooms using unique IDs.
3. **WebRTC Connection:** WebRTC is used for video and audio communication.
4. **Reat-Time Communication:** Socket.IO manages real-time chant and signalling.

## **Screenshots**

- **Login/Signup Page**
  <img src="Readme-assets/Home_dark.png" alt="Home-Page">
  <img src="Readme-assets/Home_light.png" alt="Home-Page">

- **Validation**
  <img src="Readme-assets/validation.png" alt="Validation-Page">

- **Lobby Page**
  <img src="Readme-assets/lobby.png" alt="Lobby-Page">

- **Room-Joining**
  <img src="Readme-assets/room_join.png" alt="Room_Join-Page">
- **Room Page**
  <img src="Readme-assets/room.png" alt="Room-Page">

- **Chat Page**
  <img src="Readme-assets/chat.png" alt="Chat-Page">

- **Call Page**
  <img src="Readme-assets/call.png" alt="Call-Page">
