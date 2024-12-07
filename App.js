import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import MoneyScreen from './screens/MoneyScreen';
import TransferScreen from './screens/TransferScreen';
import ReceiveMoneyScreen from './screens/ReceiveMoneyScreen';
import TransactionScreen from './screens/TransactionScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: 'Signup' }}
        />
        <Stack.Screen
         name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Dashboard' }}
        />
        <Stack.Screen
          name="Money"
          component={MoneyScreen}
          options={{ title: 'Money' }}
        />
        <Stack.Screen
          name="Transfer"
          component={TransferScreen}
          options={{ title: 'Transfer'}}
        />
        <Stack.Screen
          name="ReceiveMoney"
          component={ReceiveMoneyScreen}
          options={{ title: 'ReceiveMoney'}}
        />
         <Stack.Screen
          name="Transactions"
          component={TransactionScreen}
          options={{ title: 'Transactions' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}