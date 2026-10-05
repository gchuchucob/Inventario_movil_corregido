import { useEffect, useState } from 'react';

const KEY = 'inven_dark_mode';

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // 1. Preferencia guardada por el usuario
    const stored = localStorage.getItem(KEY);
    if (stored !== null) return stored === 'true';
    // 2. Fallback: preferencia del sistema operativo
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(KEY, String(isDark));
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);

  return { isDark, toggle, setIsDark };
}
