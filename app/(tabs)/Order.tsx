// app/(tabs)/Order.tsx
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ReservationItem {
  restaurantId: string;
  restaurantName: string;
  location: string;
  variant: 'regular' | 'vip';
  tableCount: number;
  status: 'pending' | 'paid';
  date: string;
}

export default function Order() {
  // Contoh data reservasi (dalam implementasi nyata bisa dari state management/API)
  const reservations: ReservationItem[] = [
    {
      restaurantId: '1',
      restaurantName: 'Resto A',
      location: 'Jl. Kebon Jeruk',
      variant: 'vip',
      tableCount: 3,
      status: 'pending',
      date: new Date().toLocaleDateString(),
    },
    {
      restaurantId: '2',
      restaurantName: 'Resto B',
      location: 'Jl. Asia Afrika',
      variant: 'regular',
      tableCount: 2,
      status: 'paid',
      date: new Date().toLocaleDateString(),
    },
  ];

  const handlePayment = (item: ReservationItem) => {
    Alert.alert(
      'Konfirmasi Pembayaran',
      `Apakah Anda yakin ingin melakukan pembayaran untuk reservasi di ${item.restaurantName}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Bayar',
          onPress: () => {
            Alert.alert('Sukses', 'Pembayaran berhasil!');
          },
        },
      ]
    );
  };

  const handleCancel = (item: ReservationItem) => {
    Alert.alert(
      'Konfirmasi Pembatalan',
      `Apakah Anda yakin ingin membatalkan reservasi di ${item.restaurantName}?`,
      [
        { text: 'Tidak', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Sukses', 'Reservasi dibatalkan!');
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'paid' ? '#4CAF50' : '#FFA500';
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Daftar Reservasi
          </ThemedText>
        </View>

        {reservations.map((item, index) => (
          <View key={index} style={styles.reservationCard}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.restaurantName}>
                {item.restaurantName}
              </ThemedText>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) }
              ]}>
                <ThemedText style={styles.statusText}>
                  {item.status === 'paid' ? 'Sudah Bayar' : 'Belum Bayar'}
                </ThemedText>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#888" />
                <ThemedText style={styles.infoText}>{item.location}</ThemedText>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={16} color="#888" />
                <ThemedText style={styles.infoText}>{item.date}</ThemedText>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="star-outline" size={16} color="#888" />
                <ThemedText style={styles.infoText}>
                  Varian: {item.variant.toUpperCase()}
                </ThemedText>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="restaurant-outline" size={16} color="#888" />
                <ThemedText style={styles.infoText}>
                  Jumlah Meja: {item.tableCount}
                </ThemedText>
              </View>
            </View>

            <View style={styles.cardActions}>
              {item.status === 'pending' && (
                <>
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => handlePayment(item)}
                  >
                    <ThemedText style={styles.buttonText}>Bayar</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => handleCancel(item)}
                  >
                    <ThemedText style={styles.buttonText}>Batalkan</ThemedText>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001f3f',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: '#fff',
  },
  reservationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});