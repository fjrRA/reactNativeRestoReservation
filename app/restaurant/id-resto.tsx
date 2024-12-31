import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

interface RestaurantDetail {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  pictureId: string;
  menus: {
    foods: { name: string }[];
    drinks: { name: string }[];
  };
  rating: number;
}

export default function RestaurantDetailPage() {
  const { id } = useLocalSearchParams(); // Gunakan useLocalSearchParams untuk mendapatkan parameter URL
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      if (!id || typeof id !== "string") {
        setError("ID restoran tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://restaurant-api.dicoding.dev/detail/${id}`
        );
        const data = await response.json();

        if (data.error) {
          setError(data.message || "Gagal mengambil detail restoran.");
        } else {
          setRestaurant(data.restaurant);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantDetail();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Detail restoran tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: `https://restaurant-api.dicoding.dev/images/large/${restaurant.pictureId}`,
        }}
        style={styles.image}
      />
      <Text style={styles.name}>{restaurant.name}</Text>
      <Text style={styles.city}>{restaurant.city}</Text>
      <Text style={styles.address}>{restaurant.address}</Text>
      <Text style={styles.description}>{restaurant.description}</Text>
      <Text style={styles.sectionTitle}>Menu:</Text>
      <Text style={styles.menuTitle}>Makanan:</Text>
      {restaurant.menus.foods.map((food, index) => (
        <Text key={index} style={styles.menuItem}>
          {food.name}
        </Text>
      ))}
      <Text style={styles.menuTitle}>Minuman:</Text>
      {restaurant.menus.drinks.map((drink, index) => (
        <Text key={index} style={styles.menuItem}>
          {drink.name}
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  city: {
    fontSize: 18,
    color: "#666",
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    color: "#888",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  menuItem: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 2,
  },
  errorText: {
    fontSize: 18,
    color: "#f00",
    textAlign: "center",
    marginTop: 20,
  },
});
