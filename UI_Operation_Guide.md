# BumpDaily - UI Operation Guide

## Overview
BumpDaily is a comprehensive pregnancy wellness application built with React, TypeScript, and modern web technologies. It provides expectant mothers with tools to track mood, sleep, tasks, and connect with a supportive community.

## Application Architecture

### Technology Stack
- **Frontend**: React 18 with TypeScript
- **Bundler**: Vite
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **State Management**: React Query + Local State
- **Form Handling**: React Hook Form + Zod validation

## Navigation Structure

### Mobile Navigation (`src/components/Navigation.tsx`)
The app uses a bottom tab navigation for mobile devices with three main sections:

1. **Home** (`/`) - Community feed and social features
2. **Trackers** (`/trackers`) - Mood, sleep, and task tracking
3. **Profile** (`/profile`) - User settings and pregnancy journey stats

### Desktop Navigation
Desktop users see a horizontal navigation header with the same three sections plus a greeting message.

### Routing Structure (`src/App.tsx`)
```
/ → Home (Community Feed)
/trackers → Wellness Trackers
/add-task → Task Creation Hub
/my-tasks → Task Management
/add-task/doctor-appointment → Doctor Appointment Form
/add-task/vitamin-supplement → Vitamin/Supplement Form
/add-task/medical-test → Medical Test Form
/add-task/personal-reminder → Personal Reminder Form
/library → Content Library (placeholder)
/profile → User Profile & Settings
```

## Core UI Components

### 1. Community Feed (`src/components/CommunityFeed.tsx`)
**Location**: Home page (`/`)
**Functionality**:
- Displays pregnancy support posts with tags, content, images
- Search functionality across posts and topics
- Tag-based filtering system with predefined categories
- Interactive features: like posts, comment, share
- Create new posts with floating action button
- Post creation modal with tag selection and image upload

**Key Features**:
- Real-time search across post content and tags
- Tag filtering: "General Pregnancy", "Trimester Support", "Baby Nutrition", etc.
- Post interaction with heart (like), comment, and share buttons
- User avatars with username display
- Responsive card-based layout

### 2. Wellness Trackers (`src/pages/Trackers.tsx`)
**Location**: Trackers page (`/trackers`)
**Structure**: Tabbed interface with three main sections:

#### Mood Tracker Tab
- Mood selection with emoji-based interface
- Reason selection for mood changes
- Notes input for detailed tracking
- Evidence-based insights and tips

#### Sleep Tracker Tab  
- Circular sleep time selector for bedtime and wake time
- Sleep duration calculation and display
- Sleep quality rating system
- Recent sleep history view
- Rotating sleep tips with pregnancy-specific advice

#### Tasks Tab
- Four specialized task modules:
  - **Doctor Appointment**: Schedule and track medical visits
  - **Vitamin/Supplement**: Daily supplement tracking
  - **Medical Test**: Log test results and schedules
  - **Personal Reminder**: Custom wellness reminders
- Daily wellness task checklist
- Task completion tracking with progress indicators

### 3. Profile Management (`src/pages/Profile.tsx`)
**Functionality**:
- Pregnancy journey overview with current week, due date, progress
- Personal information editing (name, due date, language)
- Notification preferences toggle
- Wellness journey statistics display
- Data privacy and security information

## State Management Architecture

### Local State Pattern
Each component manages its own state using React's `useState`:
```typescript
// Example from CommunityFeed
const [posts, setPosts] = useState<Post[]>(mockPosts);
const [selectedTag, setSelectedTag] = useState<string | null>(null);
const [searchQuery, setSearchQuery] = useState('');
```

### Global State Systems

#### Toast Notifications
- Custom hook: `useToast()` (`src/hooks/use-toast.ts`)
- Global notification system with reducer pattern
- Used across components for user feedback

#### React Query Setup
- Configured for server state management (`src/App.tsx`)
- Currently using mock data, ready for API integration

### Data Persistence
- **localStorage**: Used for task management and user preferences
- **Mock Data**: All components currently use hardcoded data
- **Future Ready**: Infrastructure prepared for server integration

## User Interaction Flow

### 1. Community Interaction
```
Home → Browse Posts → Filter by Tag → Search → Like/Comment → Create Post
```

### 2. Wellness Tracking
```
Trackers → Select Tab (Mood/Sleep/Tasks) → Input Data → Save → View History
```

### 3. Task Management
```
Trackers → Tasks Tab → Select Module → Fill Form → Save → View My Tasks
```

### 4. Profile Management
```
Profile → Edit Information → Update Preferences → Save Changes
```

## Responsive Design

### Mobile-First Approach
- Bottom navigation for mobile devices
- Touch-optimized interaction areas
- Swipeable tab interface
- Responsive grid layouts

### Desktop Enhancements
- Header navigation with branding
- Multi-column layouts
- Hover states and larger click areas
- Enhanced visual hierarchy

## Data Models

### Post Structure
```typescript
interface Post {
  id: string;
  tag: string;           // Community category
  content: string;       // Post text content
  image?: string;        // Optional image
  likes: number;         // Like count
  comments: number;      // Comment count
  isLiked: boolean;     // User interaction state
  username: string;      // Author name
  avatar: string;        // Author avatar
  timestamp: string;     // Relative time
}
```

### Task Structure
```typescript
interface Task {
  id: string;
  title: string;
  type: string;          // Module type
  completed: boolean;    // Completion status
  dueDate?: Date;       // Optional due date
  description?: string;  // Task details
  metadata: object;     // Type-specific data
}
```

## UI Component Library (shadcn/ui)

### Available Components
- **Layout**: Card, Separator, Tabs, Accordion
- **Input**: Button, Input, Textarea, Select, Checkbox
- **Feedback**: Alert, Toast, Badge, Progress
- **Navigation**: Dialog, Dropdown Menu, Sheet
- **Data Display**: Avatar, Calendar, Chart, Table

### Theming System
- Tailwind CSS for styling
- Custom color palette for pregnancy wellness theme
- Responsive breakpoint system
- Dark mode support infrastructure

## Accessibility Features

### Built-in Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility

### User Experience Enhancements
- Loading states and transitions
- Error handling with user feedback
- Offline-capable design patterns
- Progressive enhancement

## Future Integration Points

### API Integration
- React Query infrastructure ready
- Form submission endpoints prepared
- Authentication system scaffolding
- Real-time updates capability

### Enhanced Features
- Push notification system
- Calendar integration
- Export functionality for wellness data
- Healthcare provider sharing
- Community moderation tools

## Development Workflow

### Component Development
1. **Structure**: Each page/component in dedicated file
2. **Styling**: Tailwind classes with custom theme variables
3. **State**: Local useState with custom hooks for shared logic
4. **Validation**: Zod schemas for form validation
5. **Testing**: Ready for Jest/React Testing Library

### Code Organization
```
src/
├── components/       # Reusable UI components
├── pages/           # Route-based page components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── ui/              # shadcn/ui components
```

This comprehensive UI operation guide provides developers and stakeholders with a complete understanding of how the BumpDaily application functions, its architecture, and interaction patterns.