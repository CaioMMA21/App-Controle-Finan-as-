import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importação das telas (vamos criar em seguida)
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import ReportsScreen from '../screens/ReportsScreen';
import CurrencyScreen from '../screens/CurrencyScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator({ transactions }: any) {
  // Calcula saldo, receitas e despesas
  const income = transactions.filter((t: any) => t.type === 'income').reduce((acc: number, t: any) => acc + t.amount, 0);
  const expense = transactions.filter((t: any) => t.type === 'expense').reduce((acc: number, t: any) => acc + t.amount, 0);
  const balance = income - expense;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        children={() => <HomeScreen balance={balance} income={income} expense={expense} />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Transações"
        children={() => <TransactionsScreen transactions={transactions} />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="swap-horizontal" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Adicionar"
        component={AddTransactionScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Moedas"
        component={CurrencyScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="currency-usd" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Relatórios"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('transactions');
      setTransactions(stored ? JSON.parse(stored) : []);
    };
    const unsubscribe = setInterval(load, 1000); // Atualiza a cada 1s
    return () => clearInterval(unsubscribe);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          children={() => <TabNavigator transactions={transactions} />}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 