import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
    message: string;
    onRetry?: () => void;
    isDarkMode: boolean;
    variant?: 'default' | 'compact';
}

export function ErrorDisplay({ message, onRetry, isDarkMode, variant = 'default' }: ErrorDisplayProps) {
    if (variant === 'compact') {
        return (
            <div className={`p-3 rounded-lg flex items-center justify-between gap-4 ${isDarkMode ? 'bg-red-900/20 text-red-200 border border-red-900/50' : 'bg-red-50 text-red-800 border border-red-100'
                }`}>
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 opacity-80" />
                    <p className="text-sm font-medium">{message}</p>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className={`p-1.5 rounded-md transition-colors ${isDarkMode
                            ? 'hover:bg-red-900/40 text-red-200'
                            : 'hover:bg-red-100 text-red-800'
                            }`}
                        aria-label="Retry"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={`p-4 rounded-lg flex flex-col items-center justify-center text-center ${isDarkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-800'
            }`}>
            <AlertCircle className="w-8 h-8 mb-2 opacity-80" />
            <p className="font-medium mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDarkMode
                        ? 'bg-red-800 hover:bg-red-700 text-white'
                        : 'bg-red-100 hover:bg-red-200 text-red-900'
                        }`}
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            )}
        </div>
    );
}
