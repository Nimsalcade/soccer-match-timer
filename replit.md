# Soccer Match Timer & Referee Match Report System

## Overview

A mobile-optimized web application for soccer referees to manage complete match workflows—from pre-match information collection through live match timing with automatic stoppage time calculation to comprehensive match report generation. The system digitizes the entire officiating process, capturing structured match data, tracking time events, managing scores, and generating exportable reports.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: shadcn/ui components built on Radix UI primitives, providing accessible and customizable UI components with a Material Design-inspired approach tailored for sports utility applications.

**Design System**:
- Typography: Roboto font family via Google Fonts CDN with specialized hierarchy for timers, scores, and match data
- Styling: Tailwind CSS with custom configuration extending the default theme with sports-appropriate color schemes and spacing
- Mobile-First: Touch-optimized design with minimum 48px touch targets and generous spacing
- Theme Support: CSS custom properties system supporting light/dark modes with HSL color values

**State Management**:
- React Query (@tanstack/react-query) for server state and data synchronization
- React Hook Form with Zod validation for form state management
- Local browser storage (localStorage) for temporary match session persistence during workflow transitions

**Routing**: Wouter for lightweight client-side routing with three main routes:
- `/` - Pre-match form (data collection)
- `/timer` - Live match timer interface
- `/report` - Post-match report generation

**Key Architectural Decisions**:
- **Component Library Choice**: shadcn/ui was chosen over a monolithic UI framework to provide flexibility and ownership of components while maintaining design consistency. Components are copied into the project rather than imported as dependencies.
- **Form Validation Strategy**: Zod schemas in the shared directory enable type-safe validation on both client and server, with drizzle-zod integration for database schema validation.
- **Mobile Optimization**: The entire interface prioritizes mobile interaction patterns with confirmation dialogs for critical actions (timer control, score changes) to prevent accidental inputs during live matches.

### Backend Architecture

**Runtime**: Node.js with Express framework

**API Design**: RESTful JSON API with resource-based endpoints:
- `POST /api/match/create` - Create new match session
- `GET /api/match/:id` - Retrieve match session
- `PATCH /api/match/:id` - Update match session
- `POST /api/match/:id/timer-event` - Record timer events
- `POST /api/match/:id/score-event` - Record score events

**Data Layer**:
- Drizzle ORM for type-safe database operations
- Schema definitions in `shared/schema.ts` shared between frontend validation and backend persistence
- In-memory storage implementation (MemStorage) for development, designed with interface pattern (IStorage) to enable future database implementations

**Key Architectural Decisions**:
- **Shared Schema Pattern**: TypeScript schemas are defined once in the shared directory and consumed by both Zod validation (frontend/API) and Drizzle ORM (database), ensuring type consistency across the stack.
- **Interface-Based Storage**: The IStorage interface abstracts storage operations, allowing the current in-memory implementation to be replaced with a database-backed implementation without changing business logic.
- **Event Sourcing Elements**: Timer and score events are stored as separate event records, enabling full audit trails and potential replay/reconstruction of match state.

### Data Storage Architecture

**Current Implementation**: In-memory Map-based storage (MemStorage class)

**Configured Database**: PostgreSQL via Neon serverless driver (@neondatabase/serverless)

**ORM**: Drizzle ORM with migrations directory configured in `drizzle.config.ts`

**Schema Structure**:
- **MatchSession**: Core entity containing pre-match data, current match state (phase, timer state, scores), and arrays of timer/score events
- **TimerEvent**: Event log for match timing (start, pause, resume, half/match end, stoppage time)
- **ScoreEvent**: Event log for goal scoring with team attribution

**Key Architectural Decisions**:
- **Event Log Pattern**: Timer and score changes are recorded as immutable event logs rather than just updating current state, providing complete match history and auditability.
- **Denormalized Match State**: Current scores, elapsed time, and stoppage time are stored directly on MatchSession for quick access, while events provide the authoritative record.
- **Migration-Ready**: Drizzle configuration is complete with PostgreSQL dialect specified, ready for database provisioning and schema push via `npm run db:push`.

### External Dependencies

**Third-Party UI Libraries**:
- Radix UI primitives (@radix-ui/*) - Accessible, unstyled UI components for dialogs, dropdowns, forms, tooltips, and more
- Lucide React - Icon system for consistent UI iconography
- cmdk - Command menu component
- embla-carousel-react - Carousel/slider functionality
- date-fns - Date formatting and manipulation

**Database & ORM**:
- @neondatabase/serverless - PostgreSQL connection driver for Neon serverless databases
- drizzle-orm - TypeScript ORM for database operations
- drizzle-zod - Integration between Drizzle schemas and Zod validation
- connect-pg-simple - PostgreSQL session store (configured but not actively used in current implementation)

**Validation & Type Safety**:
- Zod - Runtime type validation and schema definition
- @hookform/resolvers - React Hook Form integration with Zod schemas

**Development Tools**:
- Vite - Frontend build tool and development server
- TypeScript - Type safety across the entire stack
- Tailwind CSS - Utility-first CSS framework
- PostCSS with Autoprefixer - CSS processing

**Replit-Specific Integrations**:
- @replit/vite-plugin-runtime-error-modal - Enhanced error display in development
- @replit/vite-plugin-cartographer - Development tooling
- @replit/vite-plugin-dev-banner - Development environment indicator

**Key Integration Decisions**:
- **Google Fonts CDN**: Roboto and Roboto Condensed fonts loaded via CDN rather than bundled to reduce build size and leverage browser caching.
- **PostgreSQL via Neon**: Chosen for serverless deployment compatibility with automatic connection pooling and edge network optimization.
- **Radix UI Foundation**: Provides accessible component primitives that meet WCAG standards, critical for official/referee applications that may have accessibility requirements.