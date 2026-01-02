import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        relative inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
        ${isDarkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
        }
      `}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <>
          <Moon className="w-5 h-5" />
          <span className="text-sm">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-5 h-5" />
          <span className="text-sm">Light</span>
        </>
      )}
    </button>
  );
}
