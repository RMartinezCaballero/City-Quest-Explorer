# Libro Digital Homenaje - Technical Specification

## Overview
A backend-managed digital content app for a homage book project. The backend administers all content, while the mobile app provides read-only consumption for now.

## Tech Stack
- **Backend**: Node.js + NestJS + TypeORM + SQLite/PostgreSQL
- **Mobile**: Flutter + Dart
- **Design System**: Tierra y Canela (Colombia-Levant fusion)
- **Future**: React Native web app for broader access

## Architecture

### Backend Structure
```
Backend/
├── src/
│   ├── modules/
│   │   ├── auth/           # JWT authentication & authorization
│   │   ├── users/          # User management
│   │   ├── content/        # Content CRUD (stories, photos, documents)
│   │   ├── categories/     # Content categorization
│   │   └── media/          # File upload/download handling
│   ├── common/
│   │   ├── decorators/     # Custom decorators
│   │   ├── filters/        # Exception filters
│   │   ├── interceptors/   # Logging, transform
│   │   ├── guards/         # Auth guards
│   │   └── middleware/     # Custom middleware
│   ├── config/             # Environment configuration
│   ├── database/           # Migrations & seeds
│   └── main.ts
├── test/
├── package.json
├── tsconfig.json
├── nest-cli.json
└── .env.example
```

### Mobile Structure
```
App/
├── lib/
│   ├── models/             # Data models (story, category, media)
│   ├── services/           # API clients (auth, content)
│   ├── screens/            # UI screens
│   │   ├── home/
│   │   ├── content/
│   │   ├── categories/
│   │   └── about/
│   ├── widgets/            # Reusable components
│   ├── utils/              # Constants, helpers
│   ├── theme/              # Tierra y Canela theme
│   └── main.dart
├── pubspec.yaml
├── ios/
└── android/
```

## Core Features (Phase 1 - Current)

### Backend API
- **Auth**: JWT-based login for admin users
- **Content Management**: CRUD for stories, chapters, media
- **Categories**: Organize content by theme
- **Media**: Upload/download images, audio, video
- **Search**: Basic text search across content

### Mobile App (Read-Only)
- Browse content categories
- View stories with media
- Offline caching for downloaded content
- Search within content
- Language switching (future)

## Database Schema (Initial)
```
users (id, email, password_hash, role, created_at)
content (id, title, body, category_id, author_id, created_at, updated_at)
categories (id, name, description, parent_id)
media (id, content_id, type, url, caption, order)
tags (id, name)
content_tags (content_id, tag_id)
```

## API Endpoints
```
POST   /auth/login
GET    /categories
GET    /categories/:id
GET    /content
GET    /content/:id
GET    /content/search?q=...
```

## Next Steps
1. Initialize NestJS backend with TypeORM
2. Set up Flutter project with Tierra y Canela theme
3. Implement authentication flow
4. Build content management API
5. Develop mobile content screens
6. Add file upload/download functionality
