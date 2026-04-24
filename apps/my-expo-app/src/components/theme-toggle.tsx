import { Switch, View } from 'react-native';

import { Text } from '@/components/ui/text';

type ThemeToggleProps = {
  isDark: boolean;
  onToggle: (value: boolean) => void;
};

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {

  return (
    <View className="flex-row items-center gap-3 rounded-full border border-border bg-card px-4 py-2">
      <Text className="text-sm font-medium text-foreground">
        {isDark ? 'Dark' : 'Light'}
      </Text>
      <Switch
        value={isDark}
        onValueChange={onToggle}
        trackColor={{ false: '#d4d4d8', true: '#52525b' }}
        thumbColor={isDark ? '#fafafa' : '#18181b'}
      />
    </View>
  );
}
