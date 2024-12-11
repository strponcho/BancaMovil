import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';


const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!name || !lastName || !email || !password) {
      Alert.alert('Error', 'Por favor complete todos los campos.');
      return;
    }
  
    try {
      const response = await fetch("http://192.168.1.163:3000/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName: name,
          LastName: lastName,
          Email: email,
          Password: password,
        }),
      });
  
      const errorData = await response.json();
  
      if (response.status === 200) {
        console.log("Usuario registrado correctamente");
        const user = { email, password };
        await AsyncStorage.setItem('user', JSON.stringify(user));
  
        Alert.alert('Registro exitoso', 'Te has registrado correctamente.', [
          {
            text: 'Aceptar',
            onPress: () => {
              navigation.replace('Login', { message: 'Felicidades, te has registrado. Ahora ya podrás acceder a tu banca.' });
            }
          }

          
        ]);
      } else {
        Alert.alert('Error', errorData.message || 'Hubo un problema al registrar el usuario.');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor');
      console.error(error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={[styles.moon, styles.topMoon]} />
      <View style={[styles.moon, styles.bottomMoon]} />

      <Image source={require('../assets/CARLS STAR.png')} style={styles.carlsStarImage} />

      <View style={styles.oval}>
        <Text style={styles.title}>Complete the tasks</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
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

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
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
    height: 450,
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
  carlsStarImage: {
    position: 'absolute',
    top: 85,
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  buttonText: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  }
});

export default SignupScreen;

