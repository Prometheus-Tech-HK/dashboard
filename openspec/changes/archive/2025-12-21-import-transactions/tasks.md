# Tasks: Import Transactions

- [x] Setup Prisma <!-- id: 1 -->
    -   Install `prisma` and `@prisma/client`.
    -   Initialize Prisma (`bunx prisma init`).
    -   Configure `schema.prisma` with `Transaction` model.
    -   Run migration (`bunx prisma migrate dev`).
- [x] Implement Import Logic <!-- id: 2 -->
    -   Create `backend/src/utils/categorizer.ts` (helper function).
    -   Create `backend/scripts/import-csv.ts`.
    -   Implement CSV parsing (handling dates `dd.mm.yyyy` and currency formatting).
    -   Implement batch insertion.
- [x] Implement API Endpoint <!-- id: 3 -->
    -   Add `GET /transactions` route to Express app.
    -   Implement filtering logic using Prisma.
- [x] Verify Import & API <!-- id: 4 -->
    -   Run import script with `csv/bankStatement.csv`.
    -   Test API with curl/Postman.
