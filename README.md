# ChatLoft

## Table of Contents

1. [Description](#description)
    - [Built With](#built-with)
    - [Live Demo](#live-demo)
2. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
3. [Usage](#usage)

## Description

ChatLoft is a web application that allows users to join chat rooms called "Lofts" where they can engage in real-time conversations with others.

**Note:** The app is still under development, so some features may not be fully functional and the UI still needs work.

### Built With

Here are the core technologies used for this project:

-   [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
-   [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
-   [![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
-   [![Express.js](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
-   [![Socket.io](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)](https://socket.io/)
-   [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
-   [![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)

For client-side development, I use [Vite](https://vite.dev/) as the development server and build tool.

Supabase is leveraged for its cloud-hosted PostgreSQL database and cloud storage service.

### Live Demo

You can view the deployed version of the project here: [ChatLoft](https://chatloft.netlify.app)

-   Frontend hosted on

    [![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

-   Backend hosted on

    [![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

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
