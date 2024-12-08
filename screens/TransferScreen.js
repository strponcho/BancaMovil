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

  const isFocused = useIsFocused(); // Saber si la pantalla está enfocada

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (error) {
        console.error("Error al solicitar permisos de cámara:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isFocused) {
      setTempTransactions([]); // Limpiar transacciones temporales al salir
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
      console.error("Error al guardar la transacción en AsyncStorage:", error);
    }
  };

  const handleTransfer = async () => {
    if (amount && recipient) {
      if (isNaN(amount) || parseFloat(amount) <= 0) {
        Alert.alert("Error", "Por favor, ingresa una cantidad válida.");
        return;
      }

      const newTransaction = {
        id: Date.now().toString(),
        type: "Transferencia",
        name: recipient,
        amount: parseFloat(amount),
        recipient,
        date: new Date().toLocaleString(),
      };

      setTempTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
      await saveTransactionToStorage(newTransaction);

      Alert.alert("Éxito", `Transfiriendo $${amount} a ${recipient}`);
      setAmount("");
      setRecipient("");
    } else {
      Alert.alert("Error", "Por favor, completa todos los campos.");
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    try {
      if (!data) {
        throw new Error("No se detectaron datos en el código QR.");
      }

      const [prefix, amount, recipient] = data.split("/");

      if (prefix !== "transfer" || !amount || !recipient) {
        throw new Error("El formato del código QR es inválido.");
      }

      setScannedData(data);
      Alert.alert("Éxito", `Transferencia detectada: $${amount} a ${recipient}`);
    } catch (error) {
      setScanError(error.message);
      setScannedData(null);
      Alert.alert("Error", `Error al escanear el código QR: ${error.message}`);
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
          <Text>Solicitando permisos...</Text>
        ) : hasPermission === false ? (
          <Text>No se puede acceder a la cámara. Ve a configuración y habilita los permisos.</Text>
        ) : (
          <Camera
            style={StyleSheet.absoluteFillObject}
            onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned}
          >
            <View style={styles.scanButtonContainer}>
              <TouchableOpacity style={styles.scanButton} onPress={() => setIsScanning(false)}>
                <Text style={styles.scanButtonText}>Cerrar Escáner</Text>
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
            <TouchableOpacity style={styles.transferButton} onPress={handleTransfer}>
              <Text style={styles.transferButtonText}>Transferir</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.qrButton} onPress={() => setIsGeneratingQR(true)}>
            <Text style={styles.qrButtonText}>Generar Código QR</Text>
          </TouchableOpacity>
        </>
      )}

      {isGeneratingQR && (
        <View style={styles.qrContainer}>
          <QRCode value={`transfer/${amount || "0"}/${recipient || "anonimo"}`} size={200} />
          <Text style={styles.qrText}>Escanea este código para recibir la transferencia.</Text>
          <TouchableOpacity style={styles.scanButton} onPress={() => setIsGeneratingQR(false)}>
            <Text style={styles.scanButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.scanButton} onPress={() => setIsScanning(true)}>
        <Text style={styles.scanButtonText}>Escanear Código QR</Text>
      </TouchableOpacity>

      {scannedData && <Text style={styles.scannedText}>Datos Escaneados: {scannedData}</Text>}

      <View style={styles.transactionHistory}>
  <Text style={styles.historyTitle}>Transacciones Recientes</Text>

  {/* ScrollView para el desplazamiento vertical */}
  <ScrollView style={{ width: '100%' }}>
    {/* ScrollView para el desplazamiento horizontal de las transacciones */}
    <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 10 }}>
      <View style={{ width: '100%' }}>
        {/* Mapeamos las transacciones para renderizarlas */}
        {tempTransactions.length === 0 ? (
          <Text style={styles.noTransactions}>No hay transacciones registradas.</Text>
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
    paddingHorizontal: 20, // Más espacio a los lados
    paddingVertical: 10, // Espaciado vertical
    backgroundColor: "#f9f9f9", // Fondo claro para contraste
    borderRadius: 10, // Bordes redondeados
    shadowColor: "#000", // Opcional: sombra para profundidad
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyTitle: {
    fontSize: 22, // Título un poco más grande
    fontWeight: "bold",
    marginBottom: 15, // Más espacio con la lista
    color: "#333",
    textAlign: "center",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Asegura que el texto y la fecha estén alineados verticalmente
    paddingVertical: 12, // Más espacio vertical entre ítems
    paddingHorizontal: 15,
    marginBottom: 8, // Espaciado entre transacciones
    backgroundColor: "#fff", // Fondo blanco para separar ítems
    borderRadius: 8, // Bordes redondeados en cada transacción
    borderWidth: 1,
    borderColor: "#eee", // Líneas sutiles entre ítems
  },
  transactionText: {
    fontSize: 16,
    color: "#333",
    flex: 1, // Permite que el texto principal ocupe más espacio
    marginRight: 10, // Espaciado con la fecha
  },
  transactionDate: {
    fontSize: 14,
    color: "#888",
    flexShrink: 1, // Evita que las fechas desborden
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
