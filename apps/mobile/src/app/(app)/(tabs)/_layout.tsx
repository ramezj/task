import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, View } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";

export default function AppTabsLayout() {
  const theme = useTheme();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={toggleColorScheme}
        style={{
          position: "absolute",
          top: 50,
          right: 20,
          zIndex: 999,
          padding: 10,
          borderRadius: 20,
          backgroundColor: theme.backgroundElement,
        }}>
        <Feather name={isDark ? "sun" : "moon"} size={20} color={theme.text} />
      </Pressable>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#0000FF",
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            position: "absolute",
            bottom: 20,
            marginHorizontal: 20,
            height: 60,
            borderColor: "transparent",
            borderRadius: 999,
            backgroundColor: theme.primaryForeground,
            paddingBottom: 0,
            paddingTop: 0,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 8,
            borderWidth: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
        }}>
        <Tabs.Screen
          name="shop"
          options={{
            title: "Shop",
            tabBarIcon: ({ color, size }) => <Feather color={color} name="shopping-bag" size={size} />,
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color, size }) => <Feather color={color} name="shopping-cart" size={size} />,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon: ({ color, size }) => <Feather color={color} name="package" size={size} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <Feather color={color} name="user" size={size} />,
          }}
        />
        <Tabs.Screen
          name="product/[id]"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="confirm-order"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}