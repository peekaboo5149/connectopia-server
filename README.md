# Connectopia

Connectopia is a real-time chat application that allows users to connect with each other, exchange messages, and engage in conversations. Whether for personal or professional use, Connectopia provides a seamless and interactive chatting experience.

## Features

- Real-time messaging: Chat with friends and colleagues in real-time.
- User authentication: Securely log in with your account to access the chat features.
- Multi-channel chat: Join different channels or create your own for specific topics.
- Emoji and file support: Express yourself with emojis and share files within the chat.
- Notifications: Stay informed with real-time notifications for new messages.

## Technologies Used

- **Backend:** [Node.js](https://nodejs.org/), [NestJs](https://docs.nestjs.com/), [Socket.IO](https://socket.io/)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **Authentication:** [JWT (JSON Web Tokens)](https://jwt.io/)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/peekboo5149/connectopia-server.git
   ```

2. Install the dependencies:

   ```bash
   cd connectopia
   yarn install
   ```

3. Configure environment variables: Create a .env file in the root directory and provide the necessary environment variables, including database connection strings, API keys, etc.
   ```bash
   HTTP_PORT=3000
   DEV_HTTP_PORT=
   NODE_ENV=development
   HTTPS_PORT=
   DEV_HTTPS_PORT=
   MONGO_URI=mongodb://localhost:27017/connectopia
   JWT_SECRET=your_jwt_secret_key
   ```
4. Run the application:
   ```bash
   yarn start:dev
   ```
   The application will be accessible at http://localhost:3000.

### Setting up SSL for development

1. To run the server in HTTPS you will need a `private-key.pem` and a `public-certificate.pem`.Note
   that the names of these must the exact name provided here.
2. Move these file to a folder `secret`(create if needed) these folder should in the root directory of
   the application.
3. Populate the `HTTPS_PORT` or `DEV_HTTPS_PORT` in `.env` file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

> Happy chatting on Connectopia!
