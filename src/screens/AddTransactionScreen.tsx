import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddTransactionScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const handleAddTransaction = async () => {
    if (!description || !amount) {
      Alert.alert('Preencha todos os campos!');
      return;
    }
    const newTransaction = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      type,
      date: new Date().toISOString().split('T')[0],
    };
    try {
      const stored = await AsyncStorage.getItem('transactions');
      const transactions = stored ? JSON.parse(stored) : [];
      transactions.unshift(newTransaction);
      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
      setDescription('');
      setAmount('');
      setType('expense');
      Alert.alert('Transação adicionada!');
      if (navigation) navigation.goBack();
    } catch (e) {
      Alert.alert('Erro ao salvar transação!');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <Text style={[styles.title, { color: colors.onBackground }]}>Nova Transação</Text>
      <SegmentedButtons
        value={type}
        onValueChange={setType}
        buttons={[
          { value: 'expense', label: 'Despesa' },
          { value: 'income', label: 'Receita' },
        ]}
        style={styles.segmentedButtons}
      />
      <TextInput
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        label="Valor"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleAddTransaction}
        style={styles.button}
      >
        Adicionar Transação
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 8,
  },
}); 