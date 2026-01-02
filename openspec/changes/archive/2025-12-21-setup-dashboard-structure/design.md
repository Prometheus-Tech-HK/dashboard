# Design: Dashboard Architecture

## Structure
The project will be split into two top-level directories within the current root:

```text
/Users/leowang/project2/odssey-erp/dashboard/
├── backend/    # Express.js + Bun
└── frontend/   # React + Vite
```

## Backend (Express + Bun)
- **Runtime**: Bun
- **Framework**: Express.js
- **Entry Point**: `index.ts` (or `server.ts`)
- **Port**: Default to 3000 (or 3001 if frontend takes 3000)

## Frontend (React + Vite)
- **Build Tool**: Vite
- **Framework**: React
- **Language**: TypeScript (standard for new projects)
- **Port**: Default to 5173 (Vite default)
