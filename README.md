# 🚀 ChatGambit - Scalable and Secure Chat Application

ChatGambit is a modern and scalable chat application built using NestJS, TypeScript, React, websockets, Casl, Zod, and Tailwind. It provides real-time full-duplex communication with a range of capabilities, including user authentication, group creation, and advanced security features.

## 🌟 Features

- **Real-Time Communication:** 📡 ChatGambit enables real-time, full-duplex communication between users, making it ideal for chat applications and collaborative environments.

- **Group Chat:** 👥 Users can join existing chat groups or create their own, allowing for flexible and organized conversations.

- **Admin Controls:** 👑 Administrators have the ability to kick users from chat groups to maintain order and manage discussions.

- **Persistent Data** 📅 Room and user data persist for active rooms, ensuring a continuous, real-time experience.

## 🔐 Security and Functionality Enhancements

- **Rate Limiting:** ⏳ To prevent abuse, ChatGambit includes rate limiting functionality to control the number of messages sent within a specific time frame.

- **Message Acknowledgement:** ✉️ Messages sent through ChatGambit include acknowledgement to confirm successful delivery.

- **CASL Attribute-Based Authorization:** 🔐 ChatGambit leverages CASL for attribute-based authorization, that define fine-grained permissions and access control for users.

- **End-to-End Validation with Zod:** ✅ Zod ensures robust end-to-end validation, helping to maintain data integrity throughout the application.

## 🛠️ Tech Stack

- Backend:

  - NestJS
  - TypeScript
  - Postgress SQL
  - Prisma ORM
  - Docker & Docker Compose

- Frontend:

  - React
  - TypeScript
  - Tailwind CSS

- Websockets for real-time communication

## 📦 Installation and Usage

To get started with ChatGambit, follow these steps:

1. Clone the repository: `git clone https://github.com/NitinJuyal1610/ChatGambit`
2. Navigate to the project directory: `cd chatgambit`
3. Build and run the docker container `docker compose up`
