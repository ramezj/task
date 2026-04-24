import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { LoginScreen } from '@/screens/LoginScreen';
import { RegisterScreen } from '@/screens/RegisterScreen';

export default function App() {
  const [screen, setScreen] = useState<'login' | 'register'>('login');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const switchScreen = (nextScreen: 'login' | 'register') => {
    if (isTransitioning || nextScreen === screen) {
      return;
    }

    setIsTransitioning(true);
    scale.value = withTiming(
      0.985,
      {
        duration: 140,
        easing: Easing.inOut(Easing.ease),
      },
      (finished) => {
        if (!finished) {
          return;
        }

        runOnJS(setScreen)(nextScreen);
        scale.value = withTiming(1, {
          duration: 180,
          easing: Easing.inOut(Easing.ease),
        }, (expanded) => {
          if (expanded) {
            runOnJS(setIsTransitioning)(false);
          }
        });
      }
    );
  };

  return (
    <SafeAreaProvider>
      <Animated.View className="flex-1" style={animatedStyle}>
        {screen === 'login' ? (
          <LoginScreen onSignUpPress={() => switchScreen('register')} />
        ) : (
          <RegisterScreen onLoginPress={() => switchScreen('login')} />
        )}
      </Animated.View>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
