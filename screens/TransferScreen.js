import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const TransferScreen = () => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [tempTransactions, setTempTransactions] = useState([]);
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (error) {
        console.error("Error requesting camera permissions:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      setTempTransactions([]);
    }
  }, [isFocused]);

  const saveTransactionToStorage = async (newTransaction) => {
    try {
      const activeUser = await AsyncStorage.getItem("activeUser");
      if (activeUser) {
        const storedTransactions = await AsyncStorage.getItem(`transactions_${activeUser}`);
        const parsedTransactions = storedTransactions ? JSON.parse(storedTransactions) : [];
        parsedTransactions.push(newTransaction);
        await AsyncStorage.setItem(`transactions_${activeUser}`, JSON.stringify(parsedTransactions));
      }
    } catch (error) {
      console.error("Error saving transaction to AsyncStorage:", error);
    }
  };

  const handleTransfer = async () => {
    if (amount && recipient) {
      if (isNaN(amount) || parseFloat(amount) <= 0) {
        Alert.alert("Error", "Please enter a valid amount.");
        return;
      }

      const newTransaction = {
        id: Date.now().toString(),
        type: "Transfer",
        name: recipient,
        amount: parseFloat(amount),
        recipient,
        date: new Date().toLocaleString(),
      };

      setTempTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
      await saveTransactionToStorage(newTransaction);

      Alert.alert("Success", `Transferring $${amount} to ${recipient}`);
      setAmount("");
      setRecipient("");
    } else {
      Alert.alert("Error", "Please complete all fields.");
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    try {
      if (!data) {
        throw new Error("No data detected in QR code.");
      }

      const [prefix, amount, recipient] = data.split("/");

      if (prefix !== "transfer" || !amount || !recipient) {
        throw new Error("The QR code format is invalid.");
      }

      setScannedData(data);
      Alert.alert("Success", `Transfer detected: $${amount} a ${recipient}`);
    } catch (error) {
      setScanError(error.message);
      setScannedData(null);
      Alert.alert("Error", `Error scanning QR code: ${error.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>
        ${item.amount} a {item.recipient}
      </Text>
      <Text style={styles.transactionDate}>{item.date}</Text>
    </View>
  );

  if (isScanning) {
    return (
      <View style={styles.cameraContainer}>
        {hasPermission === null ? (
          <Text>Requesting permits...</Text>
        ) : hasPermission === false ? (
          <Text>Cannot access camera. Go to settings and enable permissions.</Text>
        ) : (
          <Camera
            style={StyleSheet.absoluteFillObject}
            onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned}
          >
            <View style={styles.scanButtonContainer}>
              <TouchableOpacity style={styles.scanButton} onPress={() => setIsScanning(false)}>
                <Text style={styles.scanButtonText}>Close Scanner</Text>
              </TouchableOpacity>
            </View>
          </Camera>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isGeneratingQR && (
        <>
          <Text style={styles.title}>Money transfer</Text>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Amount to transfer"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => setAmount(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Addressee"
              value={recipient}
              onChangeText={(text) => setRecipient(text)}
            />
            <TouchableOpacity style={styles.transferButton} onPress={handleTransfer}>
              <Text style={styles.transferButtonText}>Transfer</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.qrButton} onPress={() => setIsGeneratingQR(true)}>
            <Text style={styles.qrButtonText}>Generate QR Code</Text>
          </TouchableOpacity>
        </>
      )}

      {isGeneratingQR && (
        <View style={styles.qrContainer}>
          <QRCode value={`transfer/${amount || "0"}/${recipient || "anonimo"}`} size={200} />
          <Text style={styles.qrText}>Scan this code to receive the transfer.</Text>
          <TouchableOpacity style={styles.scanButton} onPress={() => setIsGeneratingQR(false)}>
            <Text style={styles.scanButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.scanButton} onPress={() => setIsScanning(true)}>
        <Text style={styles.scanButtonText}>Scan QR Code</Text>
      </TouchableOpacity>

      {scannedData && <Text style={styles.scannedText}>Scanned Data: {scannedData}</Text>}

      <View style={styles.transactionHistory}>
  <Text style={styles.historyTitle}>Recent Transactions</Text>

  <ScrollView style={{ width: '100%' }}>
    <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 10 }}>
      <View style={{ width: '100%' }}>
        {tempTransactions.length === 0 ? (
          <Text style={styles.noTransactions}>There are no transactions recorded.</Text>
        ) : (
          tempTransactions.map((transaction) => (
            <View style={styles.transactionItem} key={transaction.id}>
              <Text style={styles.transactionText}>${transaction.amount} a {transaction.recipient}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  </ScrollView>
</View>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginVertical: 20,
  },
  formContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  input: {
    width: "90%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  transferButton: {
    backgroundColor: "#F1C232",
    padding: 10,
    borderRadius: 10,
  },
  transferButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  qrButton: {
    backgroundColor: "#F1C232",
    padding: 10,
    borderRadius: 10,
  },
   qrButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  qrContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  qrText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginTop: 10,
  },
  scanButton: {
    backgroundColor: "#F1C232",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  scannedText: {
    marginTop: 20,
    fontSize: 18,
    color: "green",
  },
  transactionHistory: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10, 
    backgroundColor: "#f9f9f9", 
    borderRadius: 10, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 8, 
    backgroundColor: "#fff",
    borderRadius: 8, 
    borderWidth: 1,
    borderColor: "#eee",
  },
  transactionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  transactionDate: {
    fontSize: 14,
    color: "#888",
    flexShrink: 1,
    textAlign: "right",
  },
  noTransactions: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  scanButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
});

export default TransferScreen;
