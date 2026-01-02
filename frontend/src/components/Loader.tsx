import { Loader2 } from 'lucide-react';

interface LoaderProps {
    className?: string;
    size?: number;
}

export function Loader({ className = '', size = 24 }: LoaderProps) {
    return (
        <Loader2
            className={`animate-spin ${className}`}
            size={size}
        />
    );
}
