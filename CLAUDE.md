# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Glow Mom Guide** (also known as BumpDaily) is a pregnancy wellness application built with React, TypeScript, and Vite. It provides expectant mothers with community support, wellness tracking, and task management features.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on port 8080
- `npm run build` - Production build 
- `npm run build:dev` - Development build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Development Workflow
- Always run `npm run lint` after making code changes
- Use `npm run dev` for local development with hot reload
- The app runs on port 8080 (configured in vite.config.ts)

## Architecture & Tech Stack

### Core Technologies
- **React 18** with TypeScript
- **Vite** for bundling and development
- **React Router v6** for client-side routing  
- **Tailwind CSS** with shadcn/ui component library
- **React Query** for server state management
- **React Hook Form + Zod** for form validation
- **Lucide React** for icons

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── CommunityFeed.tsx # Main community feed component
│   ├── Navigation.tsx   # Mobile/desktop navigation
│   └── [WellnessTrackers] # Mood, sleep, task trackers
├── pages/               # Route-based page components
│   ├── Home.tsx        # Community feed page
│   ├── Trackers.tsx    # Wellness tracking dashboard
│   ├── Profile.tsx     # User profile management
│   └── [TaskForms]     # Specialized task creation forms
├── hooks/               # Custom React hooks
├── lib/                # Utility functions (utils.ts)
└── main.tsx            # Application entry point
```

## Key Application Features

### 1. Community System (BumpDaily)
- **Main Component**: `CommunityFeed.tsx` 
- **Features**: Post creation, commenting, liking, tag-based filtering
- **Communities**: Pregnancy stages, nutrition, mental health, product recommendations
- **Routing**: `/` (home), `/community/:communityName`, `/post/:postId`

### 2. Wellness Tracking
- **Main Component**: `Trackers.tsx` with tabbed interface
- **Trackers**: Mood (emoji-based), Sleep (circular time selector), Tasks (4 modules)
- **Task Modules**: Doctor appointments, vitamins/supplements, medical tests, personal reminders
- **Routing**: `/trackers`, `/add-task/*`, `/my-tasks`

### 3. Navigation Pattern
- **Mobile**: Bottom tab navigation (Home, Trackers, Profile)
- **Desktop**: Header navigation with same sections
- **Components**: `MobileNavigation` and `DesktopNavigation` in `Navigation.tsx`

## State Management Patterns

### Local State
- Each component manages own state with `useState`
- Mock data used throughout (ready for API integration)
- localStorage for task persistence and user preferences

### Global State
- **Toast System**: Custom `useToast()` hook with reducer pattern
- **React Query**: Configured for future server state management
- **Router State**: React Router for URL-based state

## Styling & UI Guidelines

### Design System
- **Primary Colors**: Pink variants (`pink-400` to `pink-600`) for branding
- **Theme Colors**: Sleep, mood, task-specific color schemes in tailwind.config.ts
- **Typography**: Inter font family, responsive text sizing
- **Effects**: Glass morphism with `backdrop-blur-md`, soft shadows

### Component Patterns
- **shadcn/ui**: Consistent component library (Button, Card, Input, etc.)
- **Responsive**: Mobile-first approach with desktop enhancements  
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
- **Animations**: Smooth transitions with tailwindcss-animate

## Key Development Considerations

### TypeScript Configuration
- Relaxed settings for rapid development: `noImplicitAny: false`, `strictNullChecks: false`
- Path aliasing: `@/*` maps to `./src/*`
- Extended with app and node-specific configs

### ESLint Rules
- React Hooks rules enforced
- React Refresh for hot reload
- Unused variables warnings disabled (`@typescript-eslint/no-unused-vars: "off"`)

### Lovable Integration
- Project connected to Lovable platform for collaborative development
- `lovable-tagger` plugin for development mode component tagging
- Changes sync automatically between local development and Lovable

## Data Models

### Post Structure (Community)
```typescript
interface Post {
  id: string;
  tag: string;          // Community category
  content: string;      // Post content
  image?: string;       // Optional image
  likes: number;
  comments: number;
  isLiked: boolean;
  username: string;
  avatar: string;
  timestamp: string;
}
```

### Task Structure (Wellness)
```typescript
interface Task {
  id: string;
  title: string;
  type: string;         // Module type
  completed: boolean;
  dueDate?: Date;
  description?: string;
  metadata: object;     // Type-specific data
}
```

## Future-Ready Architecture

### API Integration Points
- React Query infrastructure prepared
- Form submission endpoints ready
- Mock data easily replaceable with API calls
- Authentication system scaffolding in place

### Deployment
- Vite production builds optimized
- Static asset handling configured
- Environment-based configuration support
- Lovable platform deployment integration available