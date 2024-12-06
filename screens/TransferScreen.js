import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Button, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import QRCode from 'react-native-qrcode-svg';

const TransferScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  const handleTransfer = () => {
    alert(`Transfiriendo $${amount} a ${recipient}`);
  };

  const handleGenerateQR = () => {
    setIsGeneratingQR(true);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.moon, styles.topMoon]} />
      <View style={[styles.moon, styles.bottomMoon]} />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Transferencia de Dinero</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Cantidad a transferir"
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Destinatario"
          value={recipient}
          onChangeText={(text) => setRecipient(text)}
        />
        <Button title="Transferir" onPress={handleTransfer} />
      </View>

      <TouchableOpacity style={styles.qrButton} onPress={handleGenerateQR}>
        <Text style={styles.qrButtonText}>Generar Código QR</Text>
      </TouchableOpacity>

      {isGeneratingQR && (
        <View style={styles.qrContainer}>
          <QRCode
            value={`transfer/${amount}/${recipient}`}
            size={200}
            color="black"
            backgroundColor="white"
          />
          <Text style={styles.qrText}>Escanea este código para recibir la transferencia.</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => Linking.openURL('https://www.twitch.tv/')} //ejemplo de qr
      >
        <Text style={styles.scanButtonText}>Escanear Código QR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  moon: {
    position: 'absolute',
    width: 400,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#F1C232',
  },
  topMoon: {
    top: -75,
    left: '50%',
    marginLeft: -200,
  },
  bottomMoon: {
    bottom: -75,
    left: '50%',
    marginLeft: -200,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 20,
  },
  formContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  input: {
    width: '90%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  qrButton: {
    backgroundColor: '#F1C232',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  qrButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  qrContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  qrText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
  scanButton: {
    backgroundColor: '#F1C232',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default TransferScreen;
