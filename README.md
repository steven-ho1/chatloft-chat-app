# ChatLoft

## Table of Contents

1. [Description](#description)
2. [Built With](#built-with)
3. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
4. [Usage](#usage)

## Description

ChatLoft is a web application that allows users to join chat rooms called "Lofts" where they can engage in real-time conversations with others.

You can view the deployed version of the project here (hosted on Netlify for the frontend and Render for the backend): [ChatLoft](https://chatloft.netlify.app)

**Note:** The app is still under development, so some features may not be fully functional and the UI still needs work.

## Built With

Here are the core technologies used for this project:

-   ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
-   ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
-   ![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
-   ![Express.js](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
-   ![Socket.io](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)
-   ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
-   ![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)

In addition to the core technologies, Vite is used as the development server and build tool for the client-side.

## Getting Started

To get started with the project locally, follow the instructions below.

### Prerequisites

1. Install [Node.js](https://nodejs.org/en/)
2. Install [npm](https://www.npmjs.com/) for package management
3. Set up a Supabase project by visiting [Supabase](https://supabase.io/)

### Installation

To install and set up the project locally, follow these steps:

#### 1. Clone the repository

```bash
git clone https://github.com/steven-ho1/chatloft-chat-app.git
cd chatloft-chat-app
```

#### 2. Set up the web client

-   Navigate to the client-web folder and install dependencies:

```bash
cd client-web
npm ci
```

-   Create a .env file with the following environment variables (consult the .env.example file for a template):

```env
VITE_API_URL=<your_api_url_here>
VITE_SUPABASE_URL=<your_supabase_url_here>
VITE_SUPABASE_ANON_KEY=<your_supabase_anon_key_here>
```

#### 3. Set up the server

-   Navigate to the server folder and install dependencies:

```bash
cd server
npm ci
```

-   Create a .env file with the following environment variables:

```env
API_URL=<your_api_url_here>
DATABASE_URL=<your_database_url_here>

# From Supabase: Dashboard > Settings > API
JWT_SECRET=<your_jwt_secret_here>

SUPABASE_URL=<your_supabase_url_here>

# Key used to give admin privileges to the server and bypass RLS
SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key_here>
```

## Usage

-   To start the web client:

```bash
cd client-web
npm run dev
```

-   To start the server:

```bash
cd server
npm run dev
```

Once both the client and server are running locally, you can navigate to the web client in your browser (typically http://localhost:5173 for a Vite app).
