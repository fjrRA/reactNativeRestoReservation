// app/restaurant/[id].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface Restaurant {
  id: number;
  name: string;
  imageUrl: string;
  location: string;
  description: string;
  rating: number;
  menu: MenuItem[];
  openTime: string;
  closeTime: string;
  cuisine: string;
  discount?: string;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

export default function RestaurantDetail() {
  const { id, isFlashSale } = useLocalSearchParams();
  const [selectedMenu, setSelectedMenu] = useState<OrderItem[]>([]);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reservationDate, setReservationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Sample data (dalam implementasi nyata, data ini bisa diambil dari API)
  const restaurants: { [key: string]: Restaurant } = {
    "1": {
      id: 1,
      name: "Resto A",
      imageUrl:
        "https://img.freepik.com/free-photo/restaurant-hall-with-lots-table_140725-6309.jpg",
      location: "Jl. Kebon Jeruk",
      description: "Restoran dengan masakan Indonesia autentik",
      rating: 4.8,
      openTime: "10:00",
      closeTime: "22:00",
      cuisine: "Indonesian",
      discount: "50%",
      menu: [
        {
          id: 1,
          name: "Paket VIP",
          price: 35000,
          description: "Lorem ipsum dolor sit amet",
          imageUrl:
            "https://img.freepik.com/free-photo/restaurant-interior_1127-3392.jpg?t=st=1730819115~exp=1730822715~hmac=f4e3ec6e8237c53dd044912ddc8c71e5470fec1831abcac0ad52544c2400e8bf&w=826",
        },
        {
          id: 2,
          name: "Paket Reguler",
          price: 30000,
          description: "Lorem ipsum dolor sit amet",
          imageUrl:
            "https://img.freepik.com/free-photo/ancient-chinise-room_1417-1692.jpg?t=st=1730819209~exp=1730822809~hmac=f340255c4511204b27b490ba2cddb7bdd42eba34db0187a7d4d5e9f5ff96f5e6&w=900",
        },
      ],
    },
    // Add more restaurant data here
  };

  const restaurant = restaurants[id as string];

  const handleQuantityChange = (menuItem: MenuItem, increment: boolean) => {
    const existingItem = selectedMenu.find((item) => item.id === menuItem.id);

    if (existingItem) {
      if (increment) {
        setSelectedMenu((prev) =>
          prev.map((item) =>
            item.id === menuItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else if (existingItem.quantity > 0) {
        setSelectedMenu((prev) =>
          prev
            .map((item) =>
              item.id === menuItem.id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0)
        );
      }
    } else if (increment) {
      setSelectedMenu((prev) => [...prev, { ...menuItem, quantity: 1 }]);
    }
  };

  const calculateTotal = () => {
    return selectedMenu.reduce((total, item) => {
      const price =
        isFlashSale === "true" && restaurant.discount
          ? item.price * (1 - parseInt(restaurant.discount) / 100)
          : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const handleReservation = async () => {
    if (!name || !phone) {
      Alert.alert("Peringatan", "Silakan isi nama dan nomor telepon");
      return;
    }
    if (selectedMenu.length === 0) {
      Alert.alert("Peringatan", "Silakan pilih menu terlebih dahulu");
      return;
    }
    const reservationData = {
      restaurantId: id,
      restaurantName: restaurant.name,
      location: restaurant.location,
      selectedMenu: JSON.stringify(selectedMenu),
      totalPrice: calculateTotal().toString(),
      isFlashSale,
      name,
      phone,
      reservationDate: reservationDate.toISOString(),
    };

    try {
      await AsyncStorage.setItem(
        "reservation",
        JSON.stringify(reservationData)
      );
      Alert.alert("Sukses", "Reservasi berhasil disimpan");
      router.push({
        pathname: "/(tabs)/Order",
        params: reservationData,
      });
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan reservasi");
    }

    // Perbaikan format pathname
    router.push({
      pathname: "/(tabs)/Order", // Ubah menjadi huruf kecil
      params: {
        restaurantId: id,
        restaurantName: restaurant.name,
        location: restaurant.location,
        selectedMenu: JSON.stringify(selectedMenu),
        totalPrice: calculateTotal().toString(),
        isFlashSale: isFlashSale,
      },
    });
  };

  if (!restaurant) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Restaurant tidak ditemukan</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Restaurant Header Image */}
        <Image
          source={{ uri: restaurant.imageUrl }}
          style={styles.headerImage}
        />

        {/* Restaurant Info */}
        <View style={styles.content}>
          <View style={styles.headerContent}>
            <ThemedText type="title" style={styles.restaurantName}>
              {restaurant.name}
              {isFlashSale === "true" && restaurant.discount && (
                <View style={styles.discountBadge}>
                  <ThemedText style={styles.discountText}>
                    {restaurant.discount} OFF
                  </ThemedText>
                </View>
              )}
            </ThemedText>

            <View style={styles.infoRow}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <ThemedText style={styles.ratingText}>
                  {restaurant.rating.toFixed(1)}
                </ThemedText>
              </View>
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#888" />
                <ThemedText style={styles.locationText}>
                  {restaurant.location}
                </ThemedText>
              </View>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.timeText}>
                <Ionicons name="time-outline" size={16} color="#888" />{" "}
                {restaurant.openTime} - {restaurant.closeTime}
              </ThemedText>
              <ThemedText style={styles.cuisineText}>
                <Ionicons name="restaurant-outline" size={16} color="#888" />{" "}
                {restaurant.cuisine}
              </ThemedText>
            </View>

            <ThemedText style={styles.description}>
              {restaurant.description}
            </ThemedText>
          </View>

          {/* Menu Section */}
          <View style={styles.menuSection}>
            <ThemedText type="title" style={styles.menuTitle}>
              Kategori
            </ThemedText>

            {restaurant.menu.map((item) => {
              const menuItem = selectedMenu.find(
                (selected) => selected.id === item.id
              );
              const itemPrice =
                isFlashSale === "true" && restaurant.discount
                  ? item.price * (1 - parseInt(restaurant.discount) / 100)
                  : item.price;

              return (
                <View key={item.id} style={styles.menuItem}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.menuImage}
                  />
                  <View style={styles.menuInfo}>
                    <ThemedText type="subtitle" style={styles.menuName}>
                      {item.name}
                    </ThemedText>
                    <ThemedText style={styles.menuDescription}>
                      {item.description}
                    </ThemedText>
                    <View style={styles.priceContainer}>
                      <ThemedText style={styles.menuPrice}>
                        Rp {itemPrice.toLocaleString()}
                      </ThemedText>
                      {isFlashSale === "true" && restaurant.discount && (
                        <ThemedText style={styles.originalPrice}>
                          Rp {item.price.toLocaleString()}
                        </ThemedText>
                      )}
                    </View>
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item, false)}
                      >
                        <Ionicons name="remove" size={20} color="#fff" />
                      </TouchableOpacity>
                      <ThemedText style={styles.quantityText}>
                        {menuItem?.quantity || 0}
                      </ThemedText>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item, true)}
                      >
                        <Ionicons name="add" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar with Total and Reservation Button */}
      {selectedMenu.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.totalContainer}>
            <ThemedText style={styles.totalText}>Total:</ThemedText>
            <ThemedText style={styles.totalPrice}>
              Rp {calculateTotal().toLocaleString()}
            </ThemedText>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Nama"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Nomor Telepon"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <ThemedText style={styles.datePickerText}>
              Waktu Reservasi: {reservationDate.toLocaleDateString()}
            </ThemedText>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={reservationDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setReservationDate(date);
              }}
            />
          )}

          <TouchableOpacity
            style={styles.reservationButton}
            onPress={handleReservation}
          >
            <ThemedText style={styles.reservationButtonText}>
              Buat Reservasi
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  headerImage: {
    width: screenWidth,
    height: 200,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
  },
  headerContent: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  restaurantName: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
  },
  discountBadge: {
    backgroundColor: "#FF4B4B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    color: "#333",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
  timeText: {
    color: "#666",
    fontSize: 14,
  },
  cuisineText: {
    color: "#666",
    fontSize: 14,
  },
  description: {
    marginTop: 8,
    color: "#666",
    lineHeight: 20,
  },
  menuSection: {
    padding: 16,
  },
  menuTitle: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: "bold",
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
  },
  menuName: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "600",
  },
  menuDescription: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },
  quantityButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  bottomBar: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "column",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalContainer: {
    marginBottom: 16,
  },
  totalText: {
    fontSize: 14,
    color: "#666",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    color: "#333",
  },
  datePickerText: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    marginBottom: 24,
  },
  reservationButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  reservationButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
