import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from '@/screens/LoginScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';

export default function App() {
  const [screen, setScreen] = useState<'login' | 'register'>('login');

  return (
    <SafeAreaProvider>
      {screen === 'login' ? (
        <LoginScreen onSignUpPress={() => setScreen('register')} />
      ) : (
        <RegisterScreen onLoginPress={() => setScreen('login')} />
      )}
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
