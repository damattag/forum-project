# Forum Project

A modern forum application built with NestJS, Prisma, and TypeScript. This project implements a robust backend API for managing forum discussions, user authentication, and content management.

## 🚀 Features

- User authentication with JWT
- RESTful API endpoints
- Database integration with Prisma ORM
- File uploads with AWS S3
- Redis caching
- Docker support
- Comprehensive test coverage

## 🛠️ Technologies

- **Framework:** NestJS
- **Language:** TypeScript
- **ORM:** Prisma
- **Authentication:** Passport JWT
- **Testing:** Vitest
- **Linting:** Biome
- **Storage:** AWS S3
- **Caching:** Redis
- **Container:** Docker

## 📋 Prerequisites

- Node.js (LTS version)
- pnpm
- Docker and Docker Compose (for running with containers)
- Redis (for caching)

## 🚀 Getting Started

### Install Dependencies

```bash
pnpm install
```

### Environment Setup

1. Create a `.env` file:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your own values

### Generate Authentication Keys

1. Generate a private key:
```bash
openssl genrsa -out private_key.pem 2048
```

2. Extract the public key:
```bash
openssl rsa -in private_key.pem -pubout -out public_key.pem
```

3. Set appropriate permissions:
```bash
chmod 600 private_key.pem
chmod 644 public_key.pem
```

### Database Setup

1. Generate Prisma client:
```bash
pnpm prisma:generate
```

2. Run migrations:
```bash
pnpm prisma:migration
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
pnpm start:dev
```

### Production Mode
```bash
pnpm build
pnpm start:prod
```

### Using Docker
```bash
docker-compose up
```

## 🧪 Testing

### Run Unit Tests
```bash
pnpm test
```

### Run E2E Tests
```bash
pnpm test:e2e
```

### Test Coverage
```bash
pnpm test:cov
```

## 🛠️ Development Tools

### Prisma Studio
Access database through Prisma's visual interface:
```bash
pnpm prisma:studio
```

### Linting
```bash
# Check linting issues
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## 📝 License

This project is [UNLICENSED](LICENSE)
