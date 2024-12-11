import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation, route }) => {
  const message = route.params?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu email y contraseña');
      return;
    }

    try {
      const response = await fetch("http://192.168.1.163:3000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        // Si el login es exitoso
        console.log('Inicio de sesión exitoso', data);

        // Guardamos el usuario activo en AsyncStorage
        await AsyncStorage.setItem('activeUser', email);

        // Redirigir a Dashboard
        navigation.navigate('Dashboard');
      } else {
        // Si ocurre un error en el backend
        Alert.alert('Error', data.message || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      // Captura de errores si hay un problema con la conexión
      console.error(error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.moon, styles.topMoon]} />
      <View style={[styles.moon, styles.bottomMoon]} />

      <Image source={require('../assets/burger.png')} style={styles.burgerTopLeft} />
      <Image source={require('../assets/burger.png')} style={styles.burgerBottomRight} />

      <View style={styles.oval}>
        <Text style={styles.title}>Login Screen</Text>

        {message && <Text style={styles.message}>{message}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>Don’t have an account? Sign up here</Text>
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
  oval: {
    width: 350,
    height: 350,
    backgroundColor: '#F1C232',
    borderRadius: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
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
  signupText: {
    marginTop: 20,
    color: '#0000EE',
    textDecorationLine: 'underline',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  burgerTopLeft: {
    position: 'absolute',
    top: 80,
    left: 200,
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  burgerBottomRight: {
    position: 'absolute',
    bottom: 80,
    right: 200,
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  message: {
    marginBottom: 15,
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  }
});

export default LoginScreen;


