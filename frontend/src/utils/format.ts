export const formatCurrency = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const parts = formatter.formatToParts(amount);
  const currency = "KSh"; // Enforce KSh (uppercase S)
  const value = parts
    .filter(p => p.type !== 'currency' && p.type !== 'literal' && p.type !== 'minusSign')
    .map(p => p.value)
    .join('');
    
  // Reconstruct: Symbol + space + (Sign) + Value
  // Note: Intl often puts minus sign before symbol or after. We enforce our order.
  const sign = amount < 0 ? '-' : '';
  
  return `${currency} ${sign}${value}`;
};
