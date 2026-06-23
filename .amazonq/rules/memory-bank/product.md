# City Quest Explorer — Product Overview

## Purpose & Value Proposition

City Quest Explorer is a **location-based urban adventure game platform** that transforms cities into interactive playgrounds. Players follow GPS-guided routes, scan QR codes at real-world checkpoints, solve narrative mysteries, and compete in team rankings — blending tourism, escape-room gameplay, and social competition into a single mobile experience.

The flagship story, *"El Manuscrito Prohibido"*, is set in Cartagena de Indias, Colombia, and serves as the pilot experience before expansion to other cities.

---

## Key Features & Capabilities

### Gameplay
- GPS-guided city routes with ordered checkpoints
- QR code scanning at physical locations to advance through missions
- Solo and team-based game sessions
- Real-time session event tracking (location updates, QR scans, checkpoint arrivals, session finish)
- Difficulty levels per route: EASY / MEDIUM / HARD

### Social & Competitive
- Team creation and management with captain/member roles
- Live and historical rankings per route
- Score and position tracking

### Content & Narrative
- Rich narrative phases and story manuscripts (Spanish language)
- Escape room experience design (Cartagena pilot)
- Game Designer / Narrative Designer documentation packages

### Platform
- Cross-platform mobile app (iOS, Android, Web, Windows, macOS, Linux) via Flutter
- RESTful backend API (NestJS) with Swagger documentation at `/api`
- Supabase for authentication (JWT/JWKS) and optional real-time features
- PostgreSQL database managed with Prisma ORM

---

## Target Users & Use Cases

| Segment | Use Case |
|---|---|
| Tourists & visitors | Explore a city through a guided story-driven quest |
| Local groups & friend squads | Competitive team missions around the city |
| Escape room enthusiasts | Outdoor, real-world puzzle and narrative experiences |
| Tour operators & franchisees | White-label city quest experiences in new cities |
| Event organizers | Corporate team-building or tourism event activations |

---

## Current Status

- Backend API: NestJS with Prisma, pending stable DB connection (see `Todo.md`)
- Mobile app: Flutter shell with Riverpod + GoRouter, Supabase auth integrated
- Pilot city: Cartagena de Indias
- Infrastructure: Docker Compose for local dev, Supabase cloud for auth/DB
