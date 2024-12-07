import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TransactionScreen = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem("transactions");
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.error("Error al cargar las transacciones:", error);
      }
    };

    loadTransactions();
  }, []);

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      {/* Habilitamos scroll horizontal para el contenido de cada transacción */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionName}> - {item.name}</Text>
        <Text style={styles.transactionAmount}> - ${item.amount}</Text>
        <Text style={styles.transactionDate}> - {item.date}</Text>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Transacciones</Text>
      {transactions.length === 0 ? (
        <Text style={styles.noTransactions}>No hay transacciones registradas.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionName: {
    fontSize: 16,
    color: "#2E8B57",
  },
  transactionAmount: {
    fontSize: 16,
    color: "#2E8B57",
  },
  transactionDate: {
    fontSize: 14,
    color: "#888",
  },
  noTransactions: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});

export default TransactionScreen;
