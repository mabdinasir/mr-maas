# Mr MaaS Backend

**Mr MaaS Backend** is a Node.js backend service built with Express, TypeScript, and Prisma. It provides APIs for managing users and memory entries with vector embeddings stored in PostgreSQL using the `pgvector` extension. The backend is designed for AI-powered applications, leveraging vector search for semantic memory retrieval.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Overview](#api-overview)
- [Database Schema](#database-schema)
- [Linting & Formatting](#linting--formatting)
- [License](#license)
- [Contact](#contact)

---

## Features

- User management with roles (USER, ADMIN)
- Memory entry storage with 768-dimensional vector embeddings
- PostgreSQL vector search support using `pgvector`
- Input validation with Zod
- Rate limiting, CORS, and security headers with Helmet
- Cron job scheduling support
- Built with Bun runtime and PM2 for process management

---

## Tech Stack

- **Node.js** (v22.x via Bun)
- **TypeScript**
- **Express**
- **Prisma** (ORM)
- **PostgreSQL** with `pgvector` extension
- **Zod** for schema validation
- **PM2** for production process management
- **Bun** runtime
- **ESLint & Prettier** for linting and formatting

---

## Getting Started

### Prerequisites

- PostgreSQL installed locally or accessible remotely
- Bun runtime installed globally ([bun.sh](https://bun.sh))

---

## Database Setup

Follow these steps to create and prepare the PostgreSQL database for Mr MaaS:

1. **Drop existing database** (if any):

    ```bash
    dropdb -U postgres mr-maas
    ```

2. **Create a new database:**

    ```bash
    createdb -U postgres mr-maas
    ```

3. **Connect to the database:**

    ```bash
    psql -U postgres -d mr-maas
    ```

4. **Create the `vector` extension (required for pgvector support):**

    ```sql
    CREATE EXTENSION IF NOT EXISTS vector;
    ```

5. **Exit `psql` and run Prisma migrations to set up schema:**

    ```bash
    prisma migrate dev --name init
    ```

This will create all necessary tables including `MemoryEntry` with vector embedding support.

---

## Installation

1. Clone the repo:

    ```bash
    git clone https://github.com/your-org/mr-maas-backend.git
    cd mr-maas-backend
    ```

2. Install dependencies:

    ```bash
    bun install
    ```

3. Create a `.env` file in the root with your environment variables:

    ```
    DATABASE_URL=postgresql://user:password@localhost:5432/mr-maas
    PORT=3000
    JWT_SECRET=your_jwt_secret_here
    ```

4. Generate Prisma client:

    ```bash
    bun run prisma generate
    ```

5. Start the development server:

    ```bash
    bun run dev
    ```

---

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — Server port (default: 3000)
- `JWT_SECRET` — Secret used for JWT authentication

---

## Scripts

| Command             | Description                                   |
| ------------------- | --------------------------------------------- |
| `bun run dev`       | Start server in development mode              |
| `bun run build`     | Compile TypeScript and generate Prisma client |
| `bun run start`     | Start production server with PM2              |
| `bun run lint`      | Run ESLint checks                             |
| `bun run lint:fix`  | Fix linting issues automatically              |
| `bun run fmt`       | Format code with Prettier                     |
| `bun run fmt:check` | Check formatting with Prettier                |

---

## API Overview

- `/` — Basic health check endpoint returning "Mr MaaS"
- Routes configured in `@routes/index` (refer to source for full API endpoints)
- MemoryEntry and User management APIs
- Rate limited and secured with Helmet and CORS

---

## Database Schema

### MemoryEntry

| Field       | Type            | Notes                                       |
| ----------- | --------------- | ------------------------------------------- |
| `id`        | `String` (UUID) | Primary key, generated automatically        |
| `content`   | `String`        | Text content of the memory entry            |
| `embedding` | `vector(768)`   | 768-dimensional vector embedding (pgvector) |
| `createdAt` | `DateTime`      | Timestamp, default to current time          |
| `userId`    | `String` (UUID) | Foreign key to User table                   |

### User

| Field            | Type            | Notes                          |
| ---------------- | --------------- | ------------------------------ |
| `id`             | `String` (UUID) | Primary key                    |
| `password`       | `String`        | Hashed password                |
| `firstName`      | `String`        | User first name                |
| `lastName`       | `String`        | User last name                 |
| `mobile`         | `String`        | Unique mobile number           |
| `email`          | `String`        | Unique email                   |
| `isSignedIn`     | `Boolean`       | Sign-in status                 |
| `isDeleted`      | `Boolean`       | Soft delete flag               |
| `hasAcceptedTnC` | `Boolean`       | Terms & Conditions acceptance  |
| `role`           | `Role`          | User role enum (USER or ADMIN) |
| `createdAt`      | `DateTime`      | Timestamp                      |
| `updatedAt`      | `DateTime`      | Timestamp on update            |
| `profilePicture` | `String?`       | Optional profile image URL     |
| `bio`            | `String?`       | Optional bio                   |

---

## Linting & Formatting

This project uses ESLint and Prettier for consistent code style.  
Run the following to check and fix formatting issues:

```bash
bun run lint
bun run lint:fix
bun run fmt:check
bun run fmt
```

---

## License

This project is **proprietary** and all rights are reserved by the company. Unauthorized use, copying, or distribution is strictly prohibited.

---

## Contact

For internal support or questions, contact the backend engineering team.

---

_Powered by Bun, Prisma, Express, and PostgreSQL with vector embeddings for AI-powered memory management._
