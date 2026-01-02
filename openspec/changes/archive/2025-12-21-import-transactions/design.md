# Design: Transaction Import System

## Database Schema (Prisma)
```prisma
model Transaction {
  id              Int      @id @default(autoincrement())
  transactionDate DateTime
  valueDate       DateTime
  details         String
  moneyOut        Decimal
  moneyIn         Decimal
  balance         Decimal
  reference       String?  @unique
  category        String   // Enum or String
  type            String   // "INCOME" or "EXPENSE"
  createdAt       DateTime @default(now())
}
```

## Categorization Logic
The classification service will normalize the `Transaction Details` to lowercase and check for keywords:
1.  **Income**: If `Money In` > 0, Category = `Income`.
2.  **Fees & Charges**: "charge", "fee", "tax", "duty".
3.  **Mobile Transfers**: "mpesa", "pesalink", "paybill", "buy goods".
4.  **Operations & Rent**: "rent", "electricity", "water", "internet".
5.  **Staff & Wages**: "salary", "wage", "payroll".
6.  **Suppliers**: "goods", "supply", "stock".
7.  **Other Expenses**: Fallback for `Money Out` > 0.

## API Design
`GET /api/transactions`
-   **Query Params**:
    -   `from` (Date, ISO)
    -   `to` (Date, ISO)
    -   `category` (String)
    -   `type` (String: INCOME/EXPENSE)
-   **Response**: JSON array of transactions.

## Import Script
-   Command: `bun run scripts/import-csv.ts <path-to-csv>`
-   Library: `csv-parser` or native splitting (if simple).
-   Logic: Read file -> Parse -> Map -> Categorize -> Batch Insert.
