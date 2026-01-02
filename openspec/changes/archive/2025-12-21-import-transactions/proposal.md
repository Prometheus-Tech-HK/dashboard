# Proposal: Import Bank Transactions

## Goal
Enable importing bank statements from CSV into a Postgres database using Prisma, categorizing transactions automatically, and serving them via a REST API.

## Scope
-   **Database**: Set up Prisma with Postgres. Define `Transaction` model.
-   **Import Script**: Create a Node.js script to parse `csv/bankStatement.csv`, map columns, categorise transactions based on rules, and insert them into the DB.
-   **API**: Create an Express endpoint `GET /transactions` with filters (`startDate`, `endDate`, `category`, `type`).

## Categorization Rules (Heuristic)
Based on `Transaction Details`:
-   `Fees & Charges`: Contains "Charge", "Tax", "Fee".
-   `Mobile Transfers`: Contains "Mobi", "MPESA", "Pesalink".
-   `Operations & Rent`: Contains "Rent", "Utility".
-   `Staff & Wages`: Contains "Salary", "Wage".
-   `Suppliers (Stock)`: Contains "Goods", "Supplier".
-   `Income`: `Money In` > 0.
-   `Other Expenses`: Default for `Money Out` > 0 if no other match.
*Note: These are initial heuristics and will need refinement.*

## Clarification
-   The user mentioned "Fees $ Charges" (typo presumed for "&") and "Operations & & Rent" (typo for "&"). I will use standard names `Fees & Charges` and `Operations & Rent`.
-   The CSV has columns: `Transaction Date`, `Value Date`, `Transaction Details`, `Money Out`, `Money In`, `Ledger Balance`, `Bank Reference Number`.
-   `Money Out` and `Money In` are strings with commas (e.g., "1,200.00") and negative signs.
