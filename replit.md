# Overview

This is a modern full-stack web application for Cavalcante Investimentos, an investment advisory company. The application is built with React for the frontend and Express.js for the backend, designed to showcase investment services and capture leads through various forms. The site includes sections for investment simulations, client testimonials, complaint submissions, and job applications.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing (lightweight React router)
- **Form Handling**: React Hook Form with Zod validation for type-safe form schemas
- **UI Components**: Radix UI primitives with custom styling via class-variance-authority

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Cloud Database**: Neon Database (serverless PostgreSQL)
- **File Uploads**: Multer middleware for handling file uploads (resume submissions)
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot module replacement with Vite middleware integration

## Data Layer
- **Database Schema**: Four main tables - users, simulations, complaints, and job_applications
- **ORM**: Drizzle ORM with automatic TypeScript type generation
- **Validation**: Shared Zod schemas between frontend and backend for consistent validation
- **Storage Strategy**: In-memory storage fallback with interface-based design for easy database migration

## Development Environment
- **Monorepo Structure**: Client, server, and shared code in organized directories
- **Hot Reloading**: Vite dev server with Express middleware integration
- **TypeScript**: Strict type checking across all layers with path mapping
- **Build Process**: Separate build processes for client (Vite) and server (esbuild)

## External Dependencies

- **UI Framework**: Radix UI for accessible component primitives
- **Database Provider**: Neon Database for serverless PostgreSQL hosting
- **CSS Framework**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React icons and React Icons for social media icons
- **Fonts**: Google Fonts integration (Inter, DM Sans, Fira Code, Geist Mono)
- **Development Tools**: Replit-specific plugins for runtime error handling and development environment integration
- **Form Validation**: Zod for schema validation and React Hook Form for form state management
- **HTTP Client**: Native fetch API with custom wrapper for API requests
- **File Upload Processing**: Multer for handling multipart/form-data uploads