# 🚀 Modern Full-Stack Forum

A lightweight and high-performance forum application built with Next.js 15/16, focusing on seamless User Experience (UX) through Optimistic UI updates.

## 🛠 Tech Stack

- **Framework:** [Next.js 15/16 (App Router)](https://nextjs.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Better-Auth](https://www.better-auth.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

## ✨ Key Features

- **Optimistic UI:** Instant feedback on adding, editing, and deleting comments using React's `useOptimistic` hook.
- **Server Actions:** Secure and efficient server-side data mutations.
- **Nested Relations:** Optimized Prisma queries to fetch topics with author details and comment counts in a single pass.
- **Security:** Robust authentication system with support for social providers.

## ⚙️ Installation & Setup

### 1. Clone the Repository

git clone [https://github.com/your-username/your-project-name.git](https://github.com/your-username/your-project-name.git)
cd your-project-name

### 2. Install Dependencies

npm install

### 3. Environment Variables

Create a .env file in the root directory and add the following:

#### Database Connection

DATABASE_URL="postgresql://user:password@localhost:5432/forum_db"

#### Better Auth Configuration

BETTER_AUTH_SECRET="your_generated_secret"
BETTER_AUTH_URL="http://localhost:3000"

#### Social Auth Credentials (e.g., GitHub)

GITHUB_CLIENT_ID="your_client_id"
GITHUB_CLIENT_SECRET="your_client_secret"

#### Database Connection

DATABASE_URL="postgresql://user:password@localhost:5432/forum_db"

#### Better Auth Configuration

BETTER_AUTH_SECRET="your_generated_secret"
BETTER_AUTH_URL="http://localhost:3000"

#### Social Auth Credentials (e.g., GitHub)

GITHUB_CLIENT_ID="your_client_id"
GITHUB_CLIENT_SECRET="your_client_secret"

### 4. Database Initialization

Synchronize your Prisma schema with your database:

npx prisma db push

### 5. Run the Development Server

npm run dev

Open http://localhost:3000 to view the application.

## 📂 Project Structure

/app — Routes, layouts, and API endpoints.

/components — Reusable React components (Comment lists, Topic teasers, Auth forms).

/lib — Core logic (Prisma client, Better-Auth config, Helper functions).

/prisma — Database schema and migrations.

## 🚀 Deployment on Vercel

When deploying to Vercel, ensure you:

Add all .env variables to the Vercel Dashboard.

Set the Build Command to npx prisma generate && next build.
