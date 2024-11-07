// index.tsx
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
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons"; // Import ikon untuk wishlist
import { useNavigation } from "@react-navigation/native"; // Import useNavigation //tambahan navigasi
import { RootStackParamList } from "./RootStackParamList"; // Sesuaikan dengan path RootStackParamList //tambahan navigasi
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; //tambahan navigasi

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">; //tambahan navigasi

const screenWidth = Dimensions.get("window").width;

export default function Pesanan() {
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
    {
      id: 3,
      name: "Resto C",
      discount: "30%",
      imageUrl:
        "https://i.pinimg.com/564x/38/80/fe/3880fe14bf47cad9f3f646a5571a65d2.jpg",
    },
    {
      id: 4,
      name: "Resto D",
      discount: "25%",
      imageUrl:
        "https://i.pinimg.com/564x/f0/35/29/f035298d2900ff12c297836954a659a5.jpg",
    },
    {
      id: 5,
      name: "Resto E",
      discount: "35%",
      imageUrl:
        "https://i.pinimg.com/564x/6a/25/28/6a25280d93f8ed70c397020fa3048c8c.jpg",
    },
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
      location: "Purwokerto",
      imageUrl:
        "https://i.pinimg.com/564x/64/b5/56/64b55627b8c96d457fd61f3b590c2ae5.jpg",
      isWishlisted: false,
    },
    {
      id: 3,
      name: "Produk C",
      location: "Purwokerto",
      imageUrl:
        "https://i.pinimg.com/564x/38/80/fe/3880fe14bf47cad9f3f646a5571a65d2.jpg",
      isWishlisted: false,
    },
    {
      id: 4,
      name: "Produk D",
      location: "Purwokerto",
      imageUrl:
        "https://i.pinimg.com/564x/f0/35/29/f035298d2900ff12c297836954a659a5.jpg",
      isWishlisted: false,
    },
    {
      id: 5,
      name: "Produk E",
      location: "Purwokerto",
      imageUrl:
        "https://i.pinimg.com/564x/6a/25/28/6a25280d93f8ed70c397020fa3048c8c.jpg",
      isWishlisted: false,
    },
    {
      id: 6,
      name: "Produk F",
      location: "Purwokerto",
      imageUrl:
        "https://i.pinimg.com/564x/17/12/7e/17127e44905ace69adb06e6fa125f3ad.jpg",
      isWishlisted: false,
    },
  ]);

  const [countdown, setCountdown] = useState(3600);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBestProducts, setFilteredBestProducts] =
    useState(bestProducts);
  const navigation = useNavigation<NavigationProp>(); //tambahan navigasi
  const fadeAnimFlashSale = useRef(new Animated.Value(0)).current;
  const fadeAnimBestProducts = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
      <ScrollView style={styles.scrollContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari produk..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)} // Update searchQuery setiap kali teks berubah
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
          >
            {flashSales.map((item, index) => (
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
          </ScrollView>
        </Animated.View>

        <View style={styles.flashSaleHeader}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Produk Terbaik
          </ThemedText>
        </View>

        <Animated.View style={{ opacity: fadeAnimBestProducts }}>
          <View style={styles.productGrid}>
            {filteredBestProducts.map((product) => (
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
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

// Styling

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
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    color: "#888",
    fontSize: 14,
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
