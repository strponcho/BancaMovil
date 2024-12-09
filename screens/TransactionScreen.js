import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TransactionScreen = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const activeUser = await AsyncStorage.getItem('activeUser'); 
        if (activeUser) {
          const userTransactions = await AsyncStorage.getItem(`transactions_${activeUser}`);
          if (userTransactions) {
            setTransactions(JSON.parse(userTransactions));
          }
        }
      } catch (error) {
        console.error("Error al cargar las transacciones:", error);
      }
    };

    loadTransactions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Transacciones</Text>
  
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {transactions.length === 0 ? (
          <Text style={styles.noTransactions}>No hay transacciones registradas.</Text>
        ) : (
          transactions.map((item) => (
            <View style={styles.transactionItem} key={item.id}>
              <Text style={styles.transactionType}>{item.type}</Text>
              <Text style={styles.transactionName}> - {item.name}</Text>
              <Text style={styles.transactionAmount}> - ${item.amount}</Text>
              <Text style={styles.transactionDate}> - {item.date}</Text>
            </View>
          ))
        )}
      </ScrollView>
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
    textAlign: 'center', 
  },
  transactionItem: {
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
