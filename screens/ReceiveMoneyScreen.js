import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const ReceiveMoneyScreen = ({ navigation }) => {
  const user = {
    name: "John Doe",
    accountNumber: "123-456-7890",
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Receive money</Text>
      <Text style={styles.subtitle}>
      Share your QR code with the sender to receive money.
      </Text>

      <View style={styles.qrContainer}>
        <QRCode
          value={user.accountNumber}
          size={200}
          color="black"
          backgroundColor="white"
        />
        <Text style={styles.qrText}>Scan this QR code to send money.</Text>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={() => alert("Compartir QR próximamente...")}>
        <Text style={styles.shareButtonText}>Share QR Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  qrText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  shareButton: {
    backgroundColor: "#F1C232",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});

export default ReceiveMoneyScreen;