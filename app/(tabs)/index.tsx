import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  Dimensions,
  ImageBackground,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const screenWidth = Dimensions.get("window").width;

interface Restaurant {
  id: string;
  name: string;
  description: string;
  pictureId: string;
  city: string;
  rating?: number;
}

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [flashSales, setFlashSales] = useState([
    {
      id: 1,
      name: "Plat R",
      discount: "50%",
      imageUrl:
        "https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg",
    },
    {
      id: 2,
      name: "Resto B",
      discount: "40%",
      imageUrl:
        "https://i.pinimg.com/564x/17/12/7e/17127e44905ace69adb06e6fa125f3ad.jpg",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://restaurant-api.dicoding.dev/list"
        );
        const json = await response.json();
        setRestaurants(json.restaurants);
        setFilteredRestaurants(json.restaurants);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredRestaurants(restaurants);
    } else {
      const filteredData = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRestaurants(filteredData);
    }
  };

  const handleRestaurantPress = (id: string) => {
    router.push(`../restaurant/${id}`);
  };
  const [remainingTime, setRemainingTime] = useState(3600); // Contoh countdown 1 jam

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Cleanup
  }, []);

  const formatTime = (seconds: number) => {
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
      {/* Membungkus FlatList seluruh komponen */}
      <FlatList
        data={[1]} // Just a dummy array to render scroll view
        keyExtractor={(item) => String(item)}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Pencarian Produk */}
            <View style={styles.componentWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="Cari restoran..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {/* Header Flash Sale */}
            <View style={styles.componentWrapper}>
              <View style={styles.flashSaleHeader}>
                <ThemedText type="title" style={styles.sectionTitle}>
                  Flash Sale Restoran
                </ThemedText>
                <Text style={styles.countdownText}>
                  {formatTime(remainingTime)}
                </Text>
              </View>
            </View>

            {/* Carousel Flash Sale */}
            <View style={styles.componentWrapper}>
              <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={flashSales}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.flashSaleItem}
                    onPress={() =>
                      console.log(`Flash Sale item ${item.name} pressed`)
                    }
                  >
                    <ImageBackground
                      source={{ uri: item.imageUrl }}
                      style={styles.flashSaleImage}
                    >
                      <View style={styles.flashSaleTextContainer}>
                        <Text style={styles.flashSaleText}>{item.name}</Text>
                        <Text style={styles.flashSaleText}>
                          Diskon {item.discount}
                        </Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Header Best Product */}
            <View style={styles.componentWrapper}>
              <View>
                <ThemedText type="title" style={styles.sectionTitle}>
                  Produk Terbaik
                </ThemedText>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => {
          return null; // Hanya digunakan untuk ScrollView, tidak ada item tambahan
        }}
        ListFooterComponent={
          <View style={styles.componentWrapper}>
            <FlatList
              data={filteredRestaurants}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productGridItem}
                  onPress={() => handleRestaurantPress(item.id)}
                >
                  <Image
                    source={{
                      uri: `https://restaurant-api.dicoding.dev/images/medium/${item.pictureId}`,
                    }}
                    style={styles.productImage}
                  />
                  <View style={styles.productNameContainer}>
                    <ThemedText
                      style={styles.productName}
                      numberOfLines={1} // Membatasi menjadi satu baris
                      ellipsizeMode="tail"
                    >
                      {item.name}
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
                        {item.city}
                      </ThemedText>
                    </View>
                    {item.rating && (
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <ThemedText style={styles.ratingText}>
                          {item.rating.toFixed(1)}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              numColumns={2} // Menggunakan numColumns untuk menata grid
              contentContainerStyle={styles.productGrid} // Mengatur tata letak grid
              showsVerticalScrollIndicator={false}
            />
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F8",
    paddingHorizontal: 16, // Memberikan jarak kiri dan kanan yang konsisten
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  componentWrapper: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    color: "#333",
    marginTop: 48, // Menambahkan jarak atas agar tidak menabrak header
  },
  flashSaleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A19",
    marginTop: 8,
  },
  countdownText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },

  flashSaleContainer: {
    marginTop: 16, // Memberikan jarak atas untuk bagian Flash Sale
  },
  flashSaleItem: {
    marginRight: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  flashSaleImage: {
    width: screenWidth - 64,
    height: 180,
    borderRadius: 8, // Menambahkan border radius untuk gambar
    justifyContent: "flex-end",
  },
  flashSaleTextContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 8, // Border radius untuk tampilan yang rapi
    borderBottomRightRadius: 8,
  },
  flashSaleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  productGrid: {
    marginTop: 16,
    justifyContent: "space-between",
  },
  productGridItem: {
    width: (screenWidth - 48) / 2, // Jarak kiri kanan grid lebih konsisten
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    shadowColor: "#1A1A19",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 4,
  },
  productImage: {
    width: "100%",
    height: 120,
    marginBottom: 8,
    borderRadius: 8,
  },
  productNameContainer: {
    padding: 8,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1a1a1a",
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
