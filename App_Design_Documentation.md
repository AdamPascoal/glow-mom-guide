# BumpDaily - App Design & User Flow Documentation

## Table of Contents
1. [Overview](#overview)
2. [Design System](#design-system)
3. [Page Structure & Layout](#page-structure--layout)
4. [User Interaction Flow](#user-interaction-flow)
5. [Component Architecture](#component-architecture)
6. [Navigation Patterns](#navigation-patterns)
7. [Post & Community System](#post--community-system)
8. [Comments & Engagement](#comments--engagement)

---

## Overview

**BumpDaily** is a pregnancy and motherhood community app designed to connect expecting and new mothers. The app provides a supportive platform for sharing experiences, asking questions, and building connections within specialized pregnancy and parenting communities.

### Key Features
- Community-based discussions organized by pregnancy stages and topics
- Post creation and sharing capabilities
- Commenting system with nested replies
- Like/engagement functionality
- Search and discovery features
- Personalized feeds and community filtering

---

## Design System

### Color Palette
- **Primary Pink**: `pink-400` to `pink-600` (buttons, highlights, branding)
- **Soft Pink**: `pink-400/70` with transparency (glass morphism effects)
- **Purple Accents**: `purple-200`, `purple-600` (user avatars, secondary elements)
- **Gray Scale**: `gray-200` to `gray-900` (text, backgrounds, borders)
- **Blue Accents**: `blue-400` to `blue-600` (interactive elements, links)

### Typography
- **Headers**: Bold, ranging from `text-xl` to `text-2xl`
- **Body Text**: `text-sm` for content, `text-xs` for timestamps
- **User Names**: `font-medium` to `font-bold`
- **Secondary Text**: `text-muted-foreground`, `text-gray-500`

### Visual Effects
- **Glass Morphism**: `backdrop-blur-md` with transparency
- **Shadows**: `shadow-lg`, `hover:shadow-xl` for elevation
- **Borders**: Subtle with `border-gray-100`, `border-pink-300/20`
- **Transitions**: Smooth `transition-all`, `transition-colors`

---

## Page Structure & Layout

### 1. Home Page (`/`)
**Component**: `CommunityFeed.tsx`

#### Header Section
- **Logo**: "BumpDaily" (left-aligned)
- **Icons**: Search and notification bell (right-aligned)
- **Search Bar**: Expandable, appears on search icon click
- **Height**: Compact with `py-3` padding

#### Community Tags Filter
- Horizontal scrollable badge list
- "All Posts" + community-specific tags
- Clickable navigation to community pages
- Styled with `Badge` components

#### Post Feed
- Vertical list of post cards
- Each post displays:
  - Community name (top, subtle gray text)
  - User avatar (circular, with initials)
  - Username and timestamp
  - Post content
  - Engagement buttons (like, comment, share)
- Click-to-navigate to post detail

#### Floating Action Button
- Glass morphism create post button
- Fixed position: `bottom-20 right-4`
- Soft pink with transparency
- Plus icon indicator

### 2. Community Page (`/community/:communityName`)
**Component**: `Community.tsx`

#### Header
- Back navigation implied through BumpDaily branding
- Search and notification icons

#### Community Info Section
- Community icon (Users symbol in purple circle)
- Community name and description
- Post count display
- "Join" button (pink styling)
- Minimal spacing to posts section

#### Community Posts
- Similar to home feed but:
  - No community name shown in posts (redundant)
  - User info centered horizontally with avatar
  - Filtered to show only community-specific content

### 3. Post Detail Page (`/post/:postId`)
**Component**: `PostDetail.tsx`

#### Header
- Back arrow navigation
- "Post" title

#### Post Content Section
- Full post display with:
  - User avatar and info
  - Post content with full text
  - Image attachments (if any)
  - Engagement buttons with counts

#### Comment Input
- Compact design with user avatar
- Single-line input (`rows={1}`)
- Blue "Comment" submit button
- Minimal height with `min-h-[20px]`

#### Comments Section
- Threaded comment system
- Each comment shows:
  - User avatar with initials
  - Username and timestamp
  - Comment content
  - Like count and reply button
  - More options (three dots)
- **Nested Replies**: Indented with `ml-12`
- **Reply Forms**: Inline, contextual input areas

---

## User Interaction Flow

### Primary User Flows

#### 1. Browse & Discover
```
Home Page → View Posts → [Optional] Filter by Community → Read Post Details
```

#### 2. Community Engagement
```
Home Page → Click Community Tag → Community Page → Browse Community Posts → Post Details
```

#### 3. Post Creation
```
Any Page → Click Floating + Button → Create Post Modal → Fill Details → Submit → Return to Feed
```

#### 4. Post Interaction
```
Post Card → Click Post → Post Detail Page → Read → [Optional] Like/Comment/Share
```

#### 5. Comment & Reply Flow
```
Post Detail → Scroll to Comments → Add Comment OR Reply to Existing → Submit → View Updated Thread
```

### Interaction Patterns

#### Click Behaviors
- **Post Cards**: Navigate to post detail page
- **Community Tags**: Navigate to community page
- **User Avatars**: Currently non-interactive (future: user profiles)
- **Engagement Buttons**: Toggle states with immediate feedback
- **Search Icon**: Expand/collapse search input
- **Floating + Button**: Open create post modal

#### Hover Effects
- **Cards**: Subtle shadow increase (`hover:shadow-lg`)
- **Buttons**: Color transitions and scale effects
- **Interactive Text**: Color changes (gray → pink/blue)

#### Form Interactions
- **Search Input**: Auto-focus when expanded
- **Comment Input**: Real-time character input, disabled submit when empty
- **Reply Forms**: Context-aware, cancel/submit options

---

## Component Architecture

### Core Components

#### 1. `CommunityFeed.tsx`
- **Purpose**: Main feed component used by Home page
- **State Management**: Posts, search query, selected tags, modal states
- **Key Functions**: 
  - `handleLike()`: Toggle post likes
  - `navigateToCommunity()`: Community navigation
  - `handleCreatePost()`: New post creation

#### 2. `Community.tsx`
- **Purpose**: Individual community page
- **URL Params**: `communityName` for dynamic routing
- **Filtering**: Shows only posts matching community
- **Layout**: Community info + filtered post feed

#### 3. `PostDetail.tsx`
- **Purpose**: Full post view with comments
- **State Management**: Post data, comments, reply states
- **Key Functions**:
  - `handleCommentLike()`: Recursive comment like handling
  - `renderComment()`: Recursive comment rendering with replies
  - `handleSubmitReply()`: Nested reply submission

#### 4. `CreatePostModal.tsx`
- **Purpose**: Post creation interface
- **Props**: `isOpen`, `onClose`, `onSubmit`, `defaultTag`
- **Validation**: Ensures required fields before submission

### UI Components
- **Card**: Post containers with hover effects
- **Badge**: Community tags and filters
- **Button**: Various styles (ghost, outline, filled)
- **Input/Textarea**: Form inputs with custom styling
- **Toast**: Feedback notifications

---

## Navigation Patterns

### Route Structure
```
/                           → Home (CommunityFeed)
/community/:communityName   → Community Page
/post/:postId              → Post Detail Page
/trackers                  → Trackers Page
/library                   → Library Page
/profile                   → Profile Page
```

### Navigation Components
- **Back Button**: Arrow left icon with `navigate(-1)`
- **Community Links**: Direct routing with slug generation
- **Post Links**: Click-to-navigate on entire post card
- **Breadcrumbs**: Implied through header titles

### URL Handling
- **Community Slugs**: Spaces → hyphens, lowercase conversion
- **Post IDs**: Direct ID-based routing
- **Search Params**: Currently in-memory (future: URL persistence)

---

## Post & Community System

### Community Organization
**Available Communities**:
- General Pregnancy
- Trimester 1/2/3 Support
- Postpartum Support
- Baby Nutrition & Sleep
- Product Recommendations
- Mental Health & Wellness
- New Moms Connect
- First Trimester Tips

### Post Structure
```typescript
interface Post {
  id: string;
  tag: string;          // Community name
  content: string;      // Post text content
  image?: string;       // Optional image attachment
  likes: number;        // Like count
  comments: number;     // Comment count
  isLiked: boolean;     // User's like status
  username: string;     // Post author
  avatar: string;       // Avatar URL
  timestamp: string;    // Relative time
}
```

### Post Display Variations
- **Home Feed**: Shows community name + full post info
- **Community Page**: Hides community name (redundant context)
- **Post Detail**: Full expanded view with engagement stats

---

## Comments & Engagement

### Comment System Architecture

#### Comment Structure
```typescript
interface Comment {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];   // Recursive nesting
}
```

#### Threading & Nesting
- **Main Comments**: Full width display
- **Replies**: Indented with `ml-12` margin
- **Nested Depth**: Unlimited recursive nesting
- **Visual Hierarchy**: Avatar size and spacing differentiation

### Engagement Features

#### Like System
- **Post Likes**: Heart icon with count
- **Comment Likes**: Smaller heart with count
- **State Management**: Toggle with immediate UI feedback
- **Visual Feedback**: Filled red heart when liked

#### Reply System
- **Reply Button**: Shows inline reply form
- **Context**: "Reply to [username]" placeholder
- **Cancel/Submit**: Clear action options
- **State Management**: Single reply form active at a time

#### Share Functionality
- **Current**: Share icon (placeholder)
- **Future**: Native sharing, copy link, social media

---

## User Experience Considerations

### Performance Optimizations
- **Lazy Loading**: Comments load with post detail
- **Image Optimization**: Responsive image handling
- **State Persistence**: Local state management for smooth navigation
- **Transition Effects**: Smooth UI state changes

### Accessibility Features
- **Semantic HTML**: Proper heading hierarchy
- **Keyboard Navigation**: Focus management
- **Color Contrast**: Readable text on all backgrounds
- **Screen Reader Support**: Descriptive button labels

### Mobile Responsiveness
- **Touch Targets**: Minimum 44px touch areas
- **Scrollable Sections**: Horizontal tag scrolling
- **Fixed Elements**: Floating action button positioning
- **Typography Scaling**: Responsive text sizing

### User Feedback
- **Toast Notifications**: Success/error messaging
- **Loading States**: Button disabled states during actions
- **Visual Feedback**: Hover effects and state changes
- **Empty States**: Helpful messaging for no content

---

## Future Enhancement Opportunities

### User Management
- User profiles and authentication
- Follow/follower system
- User-generated community creation

### Content Features
- Image/video uploads in posts
- Post categories and tagging
- Content moderation tools
- Bookmarking and saving posts

### Social Features
- Direct messaging
- Mention system (@username)
- Community moderators
- Event creation and scheduling

### Technical Improvements
- Real-time updates (WebSocket)
- Push notifications
- Offline support
- Search with filtering and sorting

---

*This documentation provides a comprehensive overview of BumpDaily's current design and user interaction patterns. It serves as a reference for future development and maintains consistency across the application.*