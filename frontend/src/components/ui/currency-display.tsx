import { formatCurrency } from '../../utils/format';

interface CurrencyDisplayProps {
    amount: number;
    className?: string;
    symbolClassName?: string;
    showPlus?: boolean;
}

export function CurrencyDisplay({ amount, className = "", symbolClassName = "", showPlus = false }: CurrencyDisplayProps) {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const formatted = formatCurrency(absAmount);

    // Intl 'en-KE' with 'KES' usually returns "Ksh 123,456.00" (lowercase 'h')
    // We handle the symbol manually to allow for styling
    // We try to strip whatever symbol Intl provided
    const match = formatted.match(/^(Ksh|KSh)\s?/);

    if (match) {
        const numPart = formatted.substring(match[0].length).trim();
        const sign = isNegative ? '-' : (showPlus ? '+' : '');
        return (
            <span className={className}>
                <span className={`text-[0.6em] font-medium opacity-60 mr-1 align-baseline ${symbolClassName}`}>
                    KSh
                </span>
                <span>{sign}{numPart}</span>
            </span>
        );
    }

    // Fallback if format is unexpected
    return <span className={className}>{formatCurrency(amount)}</span>;
}
