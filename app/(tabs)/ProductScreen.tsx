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
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

interface FlashSale {
  id: number;
  name: string;
  discount: string;
  imageUrl: string;
  description: string;
  location: string;
}

interface Restaurant {
  id: number;
  name: string;
  imageUrl: string;
  location: string;
  rating?: number;
}

export default function ProductScreen() {
  // Data Flash Sale
  const [flashSales, setFlashSales] = useState<FlashSale[]>([
    {
      id: 1,
      name: "Resto A",
      discount: "50%",
      imageUrl:
        "https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg",
      description: "Restoran dengan masakan Indonesia autentik",
      location: "Jl. Kebon Jeruk",
    },
    {
      id: 2,
      name: "Resto B",
      discount: "40%",
      imageUrl: "https://example.com/restaurant2.png",
      description: "Restoran Jepang Modern",
      location: "Jl. Asia Afrika",
    },
    {
      id: 3,
      name: "Resto C",
      discount: "30%",
      imageUrl: "https://example.com/restaurant3.png",
      description: "Italian Restaurant",
      location: "Jl. Braga",
    },
    {
      id: 4,
      name: "Resto D",
      discount: "20%",
      imageUrl: "https://example.com/restaurant4.png",
      description: "Korean BBQ",
      location: "Jl. Dago",
    },
    {
      id: 5,
      name: "Resto E",
      discount: "10%",
      imageUrl: "https://example.com/restaurant5.png",
      description: "Chinese Food",
      location: "Jl. Pasir Kaliki",
    },
  ]);

  // Data Restaurant Regular
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: 6,
      name: "Resto F",
      imageUrl:
        "https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg",
      location: "Jl. Kebon Jeruk",
      rating: 4.5,
    },
    {
      id: 7,
      name: "Resto G",
      imageUrl: "https://example.com/restaurant6.png",
      location: "Jl. Melati",
      rating: 4.2,
    },
    {
      id: 8,
      name: "Resto H",
      imageUrl: "https://example.com/restaurant7.png",
      location: "Jl. Mawar",
      rating: 4.7,
    },
  ]);

  // State untuk search dan filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk countdown flash sale
  const [countdown, setCountdown] = useState(3600); // 1 hour in seconds

  // Effect untuk countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handler untuk navigasi ke detail restoran
  const handleRestaurantPress = (id: number) => {
    router.push(`../restaurant/${id}`);
  };

  // Format waktu untuk countdown
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handler untuk pencarian
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredData = restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRestaurants(filteredData);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Cari restoran..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {/* Flash Sale Section */}
        <View style={styles.flashSaleHeader}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Flash Sale Restoran
          </ThemedText>
          <Text style={styles.countdownText}>{formatTime(countdown)}</Text>
        </View>

        {/* Flash Sale List */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flashSaleRow}
        >
          {flashSales.map((item) => (
            <TouchableOpacity
              key={item.id}
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
          ))}
        </ScrollView>

        {/* Regular Restaurant Section */}
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
                source={{ uri: restaurant.imageUrl }}
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
                  <ThemedText style={styles.locationText}>
                    {restaurant.location}
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
    color: "#ffffff",
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
    backgroundColor: "#1A1A19",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  discountText: {
    color: "#fff",
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
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    color: "#888",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
});
