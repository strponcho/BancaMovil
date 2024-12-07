import { View, Text, FlatList, ScrollView } from "react-native";


  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.transactionScroll}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionName}>{item.name}</Text>
        <Text style={styles.transactionAmount}>${item.amount}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
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


export default TransactionScreen;
