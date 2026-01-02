## ADDED Requirements

### Requirement: Transaction Data Model
The system SHALL store bank transactions with details and categorization.

#### Scenario: Database Schema
- When I inspect the database schema
- Then I should see a `Transaction` table
- And it should have fields for `date`, `details`, `amount`, `category`, and `reference`

### Requirement: CSV Import Script
The system SHALL provide a script to import transactions from a CSV file.

#### Scenario: Running the Import Script
- Given a CSV file exists at a specified path
- When I run the import script pointing to that file
- Then the transactions should be parsed and inserted into the database
- And the number of inserted records should match the valid CSV rows

### Requirement: Automatic Categorization
The system SHALL automatically categorize transactions during import based on description keywords.

#### Scenario: Categorizing Fees
- Given a transaction detail contains "Charge" or "Fee"
- When it is imported
- Then its category should be set to "Fees & Charges"

#### Scenario: Categorizing Mobile Transfers
- Given a transaction detail contains "MPESA" or "Pesalink"
- When it is imported
- Then its category should be set to "Mobile Transfers"

#### Scenario: Categorizing Income
- Given a transaction has a positive "Money In" value
- When it is imported
- Then its category should be set to "Income"

### Requirement: Transaction API
The system SHALL expose an API to retrieve and filter transactions.

#### Scenario: Filtering by Date Range
- Given the database contains transactions from different dates
- When I request transactions with `from` and `to` parameters
- Then I should receive only transactions within that inclusive range

#### Scenario: Filtering by Category
- Given the database contains mixed categories
- When I request transactions with a `category` parameter (e.g., "Income")
- Then I should receive only transactions matching that category
