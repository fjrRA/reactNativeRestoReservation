// app/(tabs)/Order.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ReservationItem {
  restaurantId: string;
  restaurantName: string;
  location: string;
  selectedMenu: string; // Menyimpan string dari JSON menu yang dipilih
  totalPrice: string;
  isFlashSale?: string;
  name: string;
  phone: string;
  reservationDate: string;
}

export default function Order() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const reservationData = await AsyncStorage.getItem("reservation");
        if (reservationData) {
          setReservations([JSON.parse(reservationData)]);
        }
      } catch (error) {
        Alert.alert("Error", "Gagal memuat data reservasi");
      }
    };

    loadReservations();
  }, []);

  const handlePayment = (item: ReservationItem) => {
    Alert.alert(
      "Konfirmasi Pembayaran",
      `Apakah Anda yakin ingin melakukan pembayaran untuk reservasi di ${item.restaurantName}?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Bayar",
          onPress: () => console.log("Pembayaran dikonfirmasi"),
        },
      ]
    );
  };

  const handleDeleteReservation = async (restaurantId: string) => {
    Alert.alert(
      "Konfirmasi Hapus Reservasi",
      "Apakah Anda yakin ingin menghapus reservasi ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            const updatedReservations = reservations.filter(
              (reservation) => reservation.restaurantId !== restaurantId
            );
            setReservations(updatedReservations);
            await AsyncStorage.setItem(
              "reservation",
              JSON.stringify(updatedReservations)
            );
            Alert.alert("Sukses", "Reservasi telah dihapus");
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {reservations.length > 0 ? (
          reservations.map((item, index) => (
            <View key={index} style={styles.reservationItem}>
              <ThemedText style={styles.restaurantName}>
                {item.restaurantName}
              </ThemedText>
              <ThemedText>Nama: {item.name}</ThemedText>
              <ThemedText>Telepon: {item.phone}</ThemedText>
              <ThemedText>Lokasi: {item.location}</ThemedText>
              <ThemedText>Total Harga: Rp {item.totalPrice}</ThemedText>
              <ThemedText>
                Tanggal Reservasi:{" "}
                {new Date(item.reservationDate).toLocaleDateString()}
              </ThemedText>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.payButton}
                  onPress={() => handlePayment(item)}
                >
                  <Ionicons name="card" size={24} color="#fff" />
                  <ThemedText style={styles.payButtonText}>Bayar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteReservation(item.restaurantId)}
                >
                  <Ionicons name="trash" size={24} color="#fff" />
                  <ThemedText style={styles.deleteButtonText}>
                    Hapus Reservasi
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <ThemedText style={styles.emptyText}>Tidak ada reservasi.</ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  reservationItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  payButtonText: {
    color: "#fff",
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  deleteButtonText: {
    color: "#fff",
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
