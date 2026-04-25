import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useTheme } from "@/hooks/use-theme";

export default function AppTabsLayout() {
  const theme = useTheme();

return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "fade",
        tabBarActiveTintColor: "#0000FF",
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          paddingBottom: 5,
          paddingTop: 5,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
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
  );
}
