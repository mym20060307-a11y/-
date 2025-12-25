# City Bus Management System - Technical Architecture Document

## 1. Tech Stack

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Router**: Vue Router
- **State Management**: Pinia
- **Icons**: lucide-vue-next (or lucide-react equivalent for Vue)

### Backend (BFF/API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript

### Database / Storage
- **Primary**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## 2. Project Structure
```
/
├── src/
│   ├── assets/         # Static assets
│   ├── components/     # Reusable UI components
│   ├── composables/    # Vue Composables (hooks)
│   ├── layouts/        # Page layouts (e.g., DashboardLayout)
│   ├── pages/          # Application views/pages
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia stores
│   ├── types/          # TypeScript type definitions
│   └── App.vue         # Root component
├── api/                # Express backend code
│   ├── routes/         # API routes
│   └── index.ts        # Server entry point
├── .trae/              # Project documentation and config
└── package.json
```

## 3. Data Flow
1.  **Client (Vue)**: User interacts with the UI.
2.  **State (Pinia)**: Components dispatch actions to stores.
3.  **API Layer**: Stores/Composables make HTTP requests to the Express backend or directly to Supabase.
4.  **Server (Express)**: Handles business logic and validation (optional, can route directly to Supabase for simple CRUD).
5.  **Database (Supabase)**: Stores and retrieves data.

## 4. Key Technical Decisions
- **Vue 3 + TypeScript**: Ensures type safety and modern component patterns.
- **Tailwind CSS**: Rapid UI development with utility-first classes.
- **Supabase**: Provides instant backend-as-a-service features (Auth, DB) to speed up development.
