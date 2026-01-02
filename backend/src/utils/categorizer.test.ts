import { categorizeTransaction } from "./categorizer";

const tests = [
    { details: "Standard Chartered Bank Charge", moneyIn: 0, expected: "Fees & Charges" },
    { details: "MPESA Transfer to John", moneyIn: 0, expected: "Mobile Transfers" },
    { details: "KPLC PREPAID", moneyIn: 0, expected: "Operations & Rent" },
    { details: "Salary Payment July", moneyIn: 0, expected: "Staff & Wages" },
    { details: "Payment for Goods", moneyIn: 0, expected: "Suppliers (Stock)" },
    { details: "FISHERY Supplies", moneyIn: 0, expected: "Suppliers (Stock)" },
    { details: "Money for Buy Fish", moneyIn: 0, expected: "Suppliers (Stock)" },
    { details: "Fresh Tilapia order", moneyIn: 0, expected: "Suppliers (Stock)" },
    { details: "Bank to Mobile transfer for staff", moneyIn: 0, expected: "Staff & Wages" },
    { details: "Monthly Allowance", moneyIn: 0, expected: "Staff & Wages" },
    { details: "Client Payment", moneyIn: 1000, expected: "Income" },
    { details: "Unknown expense", moneyIn: 0, expected: "Other Expenses" },
];

let passed = 0;
for (const t of tests) {
    const result = categorizeTransaction(t.details, t.moneyIn);
    if (result === t.expected) {
        passed++;
    } else {
        console.error(`Failed: "${t.details}" -> Expected ${t.expected}, got ${result}`);
    }
}

console.log(`Categorizer Tests: ${passed}/${tests.length} passed.`);
if (passed === tests.length) process.exit(0);
else process.exit(1);
