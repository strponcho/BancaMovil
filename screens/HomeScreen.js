import React from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate('Login');
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Image
          source={require('../assets/CARLS STAR.png')}
          style={styles.image}
        />

        <View style={[styles.moon, styles.topMoon]} />
        <View style={[styles.moon, styles.bottomMoon]} />

        <View style={styles.oval}>
          <Text style={styles.text}>carl.s bank</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  oval: {
    width: 350,
    height: 200,
    backgroundColor: '#F1C232',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  image: {
    position: 'absolute', 
    top: 100,  
    width: 250, 
    height: 250, 
    resizeMode: 'contain', 
  },
});

export default HomeScreen;



