# Project Structure

This project follows a **traditional React architecture** with clear separation of concerns by function type.

## 📁 Directory Structure

```
src/
├── components/                  # Reusable UI components
│   ├── Login.tsx               # Login form component  
│   ├── ProtectedRoute.tsx      # Route protection wrapper
│   ├── DashboardLayout.tsx     # Dashboard layout with navigation
│   └── ui/                     # Basic UI components
│       └── LoadingSpinner.tsx  # Reusable loading spinner
│
├── pages/                      # Page components (route destinations)
│   ├── DashboardHome.tsx      # Main dashboard page
│   ├── Settings.tsx           # Settings page  
│   ├── Analytics.tsx          # Analytics page
│   └── NotFound.tsx           # 404 error page
│
├── hooks/                      # Custom React hooks
│   └── useAuth.ts             # Authentication hook
│
├── context/                    # React context providers
│   └── AuthContext.tsx        # Authentication context & provider
│
├── types/                      # TypeScript type definitions
│   └── index.ts               # All type definitions
│
├── utils/                      # Utility functions
│   ├── loaders.ts             # Route loader functions
│   └── api.ts                 # API client utilities
│
├── lib/                       # Configuration and setup
│   └── config.ts              # App configuration
│
├── assets/                    # Static assets (images, icons, etc.)
│
├── App.tsx                    # Main app component with routing
├── main.tsx                   # App entry point
└── index.css                  # Global styles
```

## 🏗️ Architecture Principles

### **Function-Based Organization**
- Components grouped by their purpose (UI components vs pages)
- Clear separation between reusable components and page-specific ones
- Business logic separated into hooks and utilities

### **Clear Separation of Concerns**
- **Components**: UI components and layouts
- **Pages**: Route-specific page components
- **Hooks**: Reusable stateful logic
- **Context**: Global state management
- **Types**: TypeScript type definitions
- **Utils**: Helper functions and API clients

### **Consistent File Structure**
- Each folder has a specific purpose and responsibility
- Easy to locate files based on their function
- Scalable structure that grows with the project

## 📦 Import Patterns

### **Component Imports**
```typescript
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
```

### **Page Imports**
```typescript
import DashboardHome from './pages/DashboardHome';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
```

### **Hook and Utility Imports**
```typescript
import { useAuth } from './hooks/useAuth';
import { dashboardLoader, apiClient } from './utils/loaders';
import type { User, DashboardData } from './types';
```

### **Context Imports**
```typescript
import { AuthProvider } from './context/AuthContext';
```

## 🔄 Data Flow

1. **Authentication**: Managed by AuthContext, consumed via useAuth hook
2. **Route Protection**: ProtectedRoute component checks auth state
3. **Data Loading**: Route loaders fetch data before component render
4. **API Communication**: Centralized API client with error handling

## 🚀 Benefits

- **Simplicity**: Easy to understand folder structure
- **Maintainability**: Clear organization by function type
- **Scalability**: Can easily add more components, pages, or utilities
- **Type Safety**: Comprehensive TypeScript coverage
- **Familiar Structure**: Follows common React project patterns
- **Team Friendly**: Easy onboarding for new developers

## 🛠️ Adding New Features

1. **New Page**: Add to `pages/` folder
2. **New Component**: Add to `components/` or `components/ui/`
3. **New Hook**: Add to `hooks/` folder
4. **New Utility**: Add to `utils/` folder
5. **New Types**: Add to `types/index.ts`

## 📋 File Naming Conventions

- **Components**: PascalCase (e.g., `Login.tsx`, `DashboardLayout.tsx`)
- **Pages**: PascalCase (e.g., `DashboardHome.tsx`, `Settings.tsx`)
- **Hooks**: camelCase starting with 'use' (e.g., `useAuth.ts`)
- **Types**: camelCase (e.g., `index.ts`)
- **Utilities**: camelCase (e.g., `api.ts`, `loaders.ts`)

## 🎯 Project Philosophy

This structure prioritizes:
- **Simplicity** over complexity
- **Convention** over configuration  
- **Discoverability** of files and functionality
- **Maintainability** for long-term development