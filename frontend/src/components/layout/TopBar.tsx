import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

interface TopBarProps {
  title: string;
}

export default function TopBar({ title }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 lg:block hidden">{title}</h1>
      {/* Mobile spacer so title doesn't overlap hamburger */}
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 lg:hidden pl-10">{title}</h1>
      <button
        onClick={toggleTheme}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg border transition-colors',
          'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800'
        )}
        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark'
          ? <Sun className="w-4 h-4 text-amber-400" />
          : <Moon className="w-4 h-4 text-gray-600" />
        }
      </button>
    </header>
  );
}
