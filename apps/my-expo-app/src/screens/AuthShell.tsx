import type { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
};

export function AuthShell({ eyebrow, title, subtitle, footer, children }: AuthShellProps) {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 overflow-hidden px-6 pb-6 pt-4">
        <View className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-amber-400/18" />
        <View className="absolute right-[-36] top-24 h-56 w-56 rounded-full bg-orange-500/14" />
        <View className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-white/6" />

        <View className="flex-1 justify-between">
          <View className="gap-6">
            <View className="gap-4 pt-4">
              <Text className="text-xs font-semibold uppercase tracking-[2.8px] text-amber-300">
                {eyebrow}
              </Text>

              <View className="gap-3">
                <Text className="text-5xl font-black leading-[56px] tracking-[-1.8px] text-white">
                  {title}
                </Text>
                <Text className="max-w-[300px] text-base leading-7 text-zinc-300">
                  {subtitle}
                </Text>
              </View>
            </View>

            <View className="rounded-[30px] border border-white/10 bg-white/[0.06] p-5">
              {children}
            </View>
          </View>

          <View className="border-t border-white/10 pt-5">{footer}</View>
        </View>
      </View>
    </SafeAreaView>
  );
}
