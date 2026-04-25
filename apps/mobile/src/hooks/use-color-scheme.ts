import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';

interface ColorSchemeContextType {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
  isDark: boolean;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useRNColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    systemColorScheme === 'dark' ? 'dark' : 'light'
  );

  const toggleColorScheme = () => {
    setColorScheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return React.createElement(
    ColorSchemeContext.Provider,
    { value: { colorScheme, toggleColorScheme, isDark: colorScheme === 'dark' } },
    children
  );
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    const systemScheme = useRNColorScheme();
    return {
      colorScheme: (systemScheme === 'dark' ? 'dark' : 'light') as ColorScheme,
      toggleColorScheme: () => {},
      isDark: systemScheme === 'dark',
    };
  }
  return context;
}