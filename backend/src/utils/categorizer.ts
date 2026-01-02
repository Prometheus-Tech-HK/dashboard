export function categorizeTransaction(details: string, moneyIn: number): string {
    const lowerDetails = details.toLowerCase();

    if (moneyIn > 0) {
        return "Income";
    }

    if (lowerDetails.match(/charge|fee|tax|duty|excise/)) {
        return "Fees & Charges";
    }

    if (lowerDetails.match(/salary|wage|payroll|staff|bank to mobile|allowance/)) {
        return "Staff & Wages";
    }

    if (lowerDetails.match(/mobi|mpesa|pesalink|paybill|buy goods/)) {
        return "Mobile Transfers";
    }

    if (lowerDetails.match(/rent|electricity|water|internet|utility|kplc|power|token/)) {
        return "Operations & Rent";
    }

    if (lowerDetails.match(/goods|supply|stock|material|fishery|buy fish|tilapia/)) {
        return "Suppliers (Stock)";
    }

    return "Other Expenses";
}
