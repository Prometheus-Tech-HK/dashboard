# Proposal: Setup Dashboard Project Structure

## Goal
Initialize the dashboard project with a `backend` (Express.js managed by Bun) and a `frontend` (React via Vite) in the root directory.

## Scope
- Create `backend/` directory with a basic Express.js setup using Bun.
- Create `frontend/` directory with a React setup using Vite.
- Ensure both services can start.

## Clarification
- The user requested "Next.js via Vite". Since Next.js uses Webpack/Turbopack and does not natively support Vite, and Vite is typically used with React, this proposal assumes a **Vite + React** setup is desired for the frontend to strictly satisfy the "via Vite" requirement.
