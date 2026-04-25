import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { View, useColorScheme as useRNColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ColorScheme = 'light' | 'dark';

interface ColorSchemeContextType {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
  isDark: boolean;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

const COLOR_SCHEME_STORAGE_KEY = 'color-scheme-preference';

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useRNColorScheme();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    AsyncStorage.getItem(COLOR_SCHEME_STORAGE_KEY).then((stored) => {
      if (stored === 'dark' || stored === 'light') {
        setColorScheme(stored);
      } else if (systemColorScheme === 'dark') {
        setColorScheme('dark');
      }
      setIsInitialized(true);
    }).catch(() => {
      setIsInitialized(true);
    });
  }, [systemColorScheme]);

  useEffect(() => {
    if (isInitialized) {
      AsyncStorage.setItem(COLOR_SCHEME_STORAGE_KEY, colorScheme).catch(() => {});
    }
  }, [colorScheme, isInitialized]);

  const toggleColorScheme = () => {
    setColorScheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const backgroundColor = colorScheme === 'dark' ? '#09090b' : '#ffffff';

  const contextValue = useMemo(() => ({
    colorScheme,
    toggleColorScheme,
    isDark: colorScheme === 'dark',
  }), [colorScheme]);

  return React.createElement(
    View,
    { style: { flex: 1, backgroundColor } },
    React.createElement(
      ColorSchemeContext.Provider,
      { value: contextValue },
      children
    )
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