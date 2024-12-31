import React from "react";
import { View, StatusBar } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Anda bisa mengganti ini dengan library ikon yang Anda gunakan

// Import halaman-halaman yang ingin Anda navigasikan
import HomeScreen from "./index";
import PesananScreen from "./Order";
import ProductScreen from "./ProductScreen";
import ProfileScreen from "./profile";

const Tab = createBottomTabNavigator();

const layout = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarActiveTintColor: "#ff6f00", // Warna ikon/teks saat aktif,
            tabBarInactiveTintColor: "#5E686D", // Warna ikon/teks saat tidak aktif,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Product"
          component={ProductScreen}
          options={{
            tabBarLabel: "Produk",
            tabBarActiveTintColor: "#ff6f00", // Warna ikon/teks saat aktif,
            tabBarInactiveTintColor: "#5E686D", // Warna ikon/teks saat tidak aktif,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bag-handle-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Pesanan"
          component={PesananScreen}
          options={{
            tabBarLabel: "Pesanan",
            tabBarActiveTintColor: "#ff6f00", // Warna ikon/teks saat aktif,
            tabBarInactiveTintColor: "#5E686D", // Warna ikon/teks saat tidak aktif,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarActiveTintColor: "#ff6f00", // Warna ikon/teks saat aktif,
            tabBarInactiveTintColor: "#5E686D", // Warna ikon/teks saat tidak aktif,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default layout;
