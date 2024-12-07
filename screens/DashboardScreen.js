import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>

      <Image
        source={require('../assets/burger.png')}
        style={styles.burgerTop1}
      />
      <Image
        source={require('../assets/burger.png')}
        style={styles.burgerTop2}
      />
      <Image
        source={require('../assets/burger.png')}
        style={styles.burgerTop3}
      />
      <Text style={styles.title}>Welcome to Bank</Text>

      <View style={styles.optionsContainer}>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Money')}>
          <Image
            source={require('../assets/CARLS STAR.png')}
            style={styles.optionImage}
          />
          <Text style={styles.optionText}>Dinero</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Transfer')}>
          <Image
            source={require('../assets/CARLS STAR.png')}
            style={styles.optionImage}
          />
          <Text style={styles.optionText}>Transferir Dinero</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ReceiveMoney')}>
          <Image
            source={require('../assets/CARLS STAR.png')}
            style={styles.optionImage}
          />
          <Text style={styles.optionText}>Recibir Dinero</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Transactions')}>
          <Ionicons name="grid" size={40} color="black" />
          <Text style={styles.optionText}>Transactions</Text>
        </TouchableOpacity>

      </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 20,
    top: -30,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  burgerTop1: {
    position: 'absolute',
    top: 38,
    left: 266,
    width: 150,
    height: 180,
    resizeMode: 'contain',
  },
  burgerTop2: {
    position: 'absolute',
    top: 300,
    left: -3,
    width: 150,
    height: 180,
    resizeMode: 'contain',
  },
  burgerTop3: {
    position: 'absolute',
    top: 460,
    left: 266,
    width: 150,
    height: 180,
    resizeMode: 'contain',
  },
  optionsContainer: {
    width: '90%',
    marginTop: 50,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  option: {
    width: '80%',
    height: 120,
    backgroundColor: '#F1C232',
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  optionImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default DashboardScreen;