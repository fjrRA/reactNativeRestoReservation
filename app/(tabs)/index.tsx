// index.tsx
// Test GitHub
import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  ImageBackground,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./RootStackParamList";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const screenWidth = Dimensions.get("window").width;

// Custom Hook untuk Infinite Scroll
const useInfiniteScroll = <T,>(items: T[], itemsPerPage: number = 4) => {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadInitialItems();
  }, [items]);

  const loadInitialItems = () => {
    const initialItems = items.slice(0, itemsPerPage);
    setDisplayedItems(initialItems);
    setHasMore(items.length > itemsPerPage);
  };

  const loadMoreItems = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newItems = items.slice(startIndex, endIndex);

    setDisplayedItems(prev => [...prev, ...newItems]);
    setPage(prev => prev + 1);
    setHasMore(endIndex < items.length);
    setLoading(false);
  };

  return { displayedItems, loading, hasMore, loadMoreItems };
};

// Modifikasi pada bagian LoadingIndicator component
const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4CAF50" />
    <View style={styles.loadingBackground}>
      <ThemedText style={styles.loadingText}>Memuat...</ThemedText>
    </View>
  </View>
);

export default function Pesanan() {
  const [flashSales, setFlashSales] = useState([
    {
      id: 1,
      name: "Plat R",
      discount: "50%",
      imageUrl:
        "https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg",
    },
    // ... other flash sales
  ]);

  const [bestProducts, setBestProducts] = useState([
    {
      id: 1,
      name: "Produk A",
      location: "Purwokerto",
      imageUrl:
        "https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg",
      isWishlisted: false,
    },
    {
      id: 2,
      name: "Produk B",
      location: "Purbalingga",
      imageUrl:
        "https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg",
      isWishlisted: false,
    },
    {
      id: 3,
      name: "Produk C",
      location: "Banjarnegara",
      imageUrl:
        "https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg",
      isWishlisted: false,
    },
    // ... other products
  ]);

  const [countdown, setCountdown] = useState(3600);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBestProducts, setFilteredBestProducts] = useState(bestProducts);
  const navigation = useNavigation<NavigationProp>();
  const fadeAnimFlashSale = useRef(new Animated.Value(0)).current;
  const fadeAnimBestProducts = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Infinite scroll hooks
  const {
    displayedItems: displayedFlashSales,
    loading: loadingFlashSales,
    hasMore: hasMoreFlashSales,
    loadMoreItems: loadMoreFlashSales
  } = useInfiniteScroll(flashSales, 2);

  const {
    displayedItems: displayedProducts,
    loading: loadingProducts,
    hasMore: hasMoreProducts,
    loadMoreItems: loadMoreProducts
  } = useInfiniteScroll(filteredBestProducts, 4);

  // Existing useEffects
  useEffect(() => {
    Animated.timing(fadeAnimFlashSale, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnimBestProducts, {
      toValue: 1,
      duration: 800,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) =>
        prevCountdown > 0 ? prevCountdown - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % flashSales.length;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex, flashSales.length]);

  useEffect(() => {
    const filteredData = bestProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBestProducts(filteredData);
  }, [searchQuery, bestProducts]);

  // Handlers
  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom) {
      loadMoreProducts();
    }
  };

  const formatTime = (seconds: number): string => {
    if (typeof seconds !== "number" || seconds < 0) {
      seconds = 0;
    }
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  interface Item {
    id: number;
    name: string;
    imageUrl: string;
    discount?: string;
  }

  const handlePress = (item: Item) => {
    Alert.alert("Informasi", `Kamu memilih: ${item.name}`);
  };

  const handleWishlistToggle = (id: number) => {
    setBestProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id
          ? { ...product, isWishlisted: !product.isWishlisted }
          : product
      )
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Cari produk..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={styles.flashSaleHeader}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Flash Sale Restoran
          </ThemedText>
          <Text style={styles.countdownText}>{formatTime(countdown)}</Text>
        </View>

        <Animated.View style={{ opacity: fadeAnimFlashSale }}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flashSaleContainer}
            onScroll={(event) => {
              const xOffset = event.nativeEvent.contentOffset.x;
              if (xOffset >= (displayedFlashSales.length - 1) * screenWidth && hasMoreFlashSales) {
                loadMoreFlashSales();
              }
            }}
            scrollEventThrottle={400}
          >
            {displayedFlashSales.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.flashSaleItem}
                onPress={() => handlePress(item)}
              >
                <ImageBackground
                  source={{ uri: item.imageUrl }}
                  style={styles.flashSaleImage}
                >
                  <View style={styles.flashSaleTextContainer}>
                    <ThemedText type="subtitle" style={styles.flashSaleText}>
                      {item.name}
                    </ThemedText>
                    <ThemedText style={styles.flashSaleText}>
                      Diskon {item.discount}
                    </ThemedText>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
            {loadingFlashSales && (
              <View style={styles.flashSaleLoadingContainer}>
                <LoadingIndicator />
              </View>
            )}
          </ScrollView>
        </Animated.View>


        <View style={styles.flashSaleHeader}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Produk Terbaik
          </ThemedText>
        </View>

        <Animated.View style={{ opacity: fadeAnimBestProducts }}>
          <View style={styles.productGrid}>
            {displayedProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.productItem}
                onPress={() => handlePress(product)}
              >
                <Image
                  source={{ uri: product.imageUrl }}
                  style={styles.productImage}
                />
                <View style={styles.productNameContainer}>
                  <ThemedText type="subtitle" style={styles.productName}>
                    {product.name}
                  </ThemedText>
                  <View style={styles.locationContainer}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color="#888"
                      style={styles.locationIcon}
                    />
                    <Text style={styles.locationText}>{product.location}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleWishlistToggle(product.id)}
                  style={styles.wishlistIcon}
                >
                  <Ionicons
                    name={product.isWishlisted ? "heart" : "heart-outline"}
                    size={24}
                    color="red"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {/* Loading Indicator for Products */}
          {loadingProducts && (
            <View style={styles.productsLoadingContainer}>
              <LoadingIndicator />
            </View>
          )}

          {/* End Message */}
          {!hasMoreProducts && displayedProducts.length > 0 && (
            <View style={styles.endMessageContainer}>
              <ThemedText style={styles.endMessage}>
                Tidak ada produk lagi
              </ThemedText>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F8",
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
    marginTop: 48,
    color: "#333",
    shadowColor: "#1A1A19",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flashSaleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 16,
    marginTop: 16,
  },
  sectionTitle: {
    color: "#1A1A19",
    fontSize: 20,
  },
  countdownText: {
    color: "#1A1A19",
    fontSize: 16,
    marginRight: 16,
  },
  flashSaleContainer: {
    paddingTop: 16,
  },
  flashSaleItem: {
    width: screenWidth - 32,
    marginHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#1A1A19",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flashSaleImage: {
    width: "100%",
    height: 200,
    justifyContent: "flex-end",
  },
  flashSaleTextContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingVertical: 8,
    paddingLeft: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  flashSaleText: {
    color: "#ffffff",
    fontSize: 16,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  productItem: {
    width: (screenWidth - 48) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 16,
    paddingBottom: 8,
    shadowColor: "#1A1A19",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
    resizeMode: "cover",
  },
  productName: { marginTop: 8, fontSize: 16, fontWeight: "bold" },
  productNameContainer: {
    paddingLeft: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: 4,
  },
  locationContainer: {
    color: "#888",
    flexDirection: "row",
    alignItems: "center",
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  loadingBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  endMessage: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    color: "#888",
    fontSize: 14,
    width: 150,
  },
  flashSaleLoadingContainer: {
    width: screenWidth - 32,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  productsLoadingContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    margin: 16,
  },
  endMessageContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    margin: 16,
  },

  wishlistIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 4, // Memberikan ruang agar ikon terlihat lebih baik
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Memberikan sedikit bayangan
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});
