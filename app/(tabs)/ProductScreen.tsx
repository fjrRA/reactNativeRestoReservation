// app/(tabs)/ProductScreen.tsx
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

interface FlashSale {
  id: string;
  name: string;
  discount: string;
  imageUrl: string;
  description: string;
  location: string;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  pictureId: string;
  city: string;
  rating?: number;
}

export default function ProductScreen() {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([
    {
      id: "1",
      name: "Resto A",
      discount: "50%",
      imageUrl:
        "https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg",
      description: "Restoran dengan masakan Indonesia autentik",
      location: "Jl. Kebon Jeruk",
    },
  ]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://restaurant-api.dicoding.dev/list"
        );
        const data = await response.json();
        setRestaurants(data.restaurants);
        setFilteredRestaurants(data.restaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredData = restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRestaurants(filteredData);
  };

  const handleRestaurantPress = (id: string) => {
    router.push(`../restaurant/${id}`);
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari restoran..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <View style={styles.flashSaleHeader}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Flash Sale Restoran
          </ThemedText>
          <Text style={styles.countdownText}>{formatTime(countdown)}</Text>
        </View>
        <FlatList
          horizontal
          data={flashSales}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.flashSaleItem}
              onPress={() => handleRestaurantPress(item.id)}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.flashSaleImage}
              />
              <View style={styles.productNameContainer}>
                <ThemedText type="subtitle" style={styles.restaurantName}>
                  {item.name}
                </ThemedText>
                <View style={styles.discountContainer}>
                  <ThemedText style={styles.discountText}>
                    Diskon {item.discount}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.flashSaleRow}
          showsHorizontalScrollIndicator={false}
        />
        <ThemedText type="title" style={styles.sectionTitle}>
          Daftar Restoran
        </ThemedText>
        <View style={styles.productList}>
          {filteredRestaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.productItem}
              onPress={() => handleRestaurantPress(restaurant.id)}
            >
              <Image
                source={{
                  uri: `https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}`,
                }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <ThemedText type="subtitle" style={styles.restaurantName}>
                  {restaurant.name}
                </ThemedText>
                <View style={styles.locationContainer}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color="#888"
                    style={styles.locationIcon}
                  />
                  <ThemedText
                    style={styles.locationText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {restaurant.city}
                  </ThemedText>
                </View>
                {restaurant.rating && (
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <ThemedText style={styles.ratingText}>
                      {restaurant.rating.toFixed(1)}
                    </ThemedText>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    color: "#333",
  },
  sectionTitle: {
    color: "#000",
    paddingHorizontal: 16,
    fontSize: 20,
    marginBottom: 12,
  },
  flashSaleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
    marginTop: 16,
  },
  countdownText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  flashSaleRow: {
    flexDirection: "row",
    marginBottom: 24,
    marginHorizontal: 8,
  },
  flashSaleItem: {
    width: (screenWidth - 48) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 8,
    paddingBottom: 8,
    shadowColor: "#1A1A19",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flashSaleImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
    resizeMode: "cover",
  },
  productNameContainer: {
    paddingHorizontal: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: 4,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountText: {
    color: "#4CAF50",
    fontSize: 14,
  },
  productList: {
    paddingHorizontal: 16,
  },
  productItem: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: "cover",
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  restaurantName: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: 14,
    color: "#888",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    color: "#FFD700",
    marginLeft: 4,
  },
});
