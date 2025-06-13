import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, useTheme, IconButton } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

interface Transaction {
  id: string;
  description: string;
  value: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  paymentMethod: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Salário',
    value: 5000,
    type: 'income',
    category: 'Salário',
    date: '2024-03-20',
    paymentMethod: 'PIX'
  },
  {
    id: '2',
    description: 'Aluguel',
    value: 1500,
    type: 'expense',
    category: 'Moradia',
    date: '2024-03-19',
    paymentMethod: 'Cartão'
  },
  {
    id: '3',
    description: 'Supermercado',
    value: 350,
    type: 'expense',
    category: 'Alimentação',
    date: '2024-03-18',
    paymentMethod: 'Dinheiro'
  }
];

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const { colors } = useTheme();

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#0B0E11' }]}>
      <Animatable.Text animation="fadeInDown" style={[styles.title, { color: '#FFFFFF' }]}>
        Transações
      </Animatable.Text>

      {transactions.map((transaction, index) => (
        <Animatable.View
          key={transaction.id}
          animation="fadeInUp"
          delay={index * 100}
        >
          <View style={styles.transactionCard}>
            <View style={styles.transactionHeader}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionCategory}>{transaction.category}</Text>
              </View>
              <IconButton
                icon="delete"
                iconColor="#F44336"
                size={20}
                onPress={() => handleDeleteTransaction(transaction.id)}
              />
            </View>
            
            <View style={styles.transactionDetails}>
              <View style={styles.transactionValue}>
                <Text style={[
                  styles.valueText,
                  { color: transaction.type === 'income' ? '#4CAF50' : '#F44336' }
                ]}>
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.value)}
                </Text>
              </View>
              
              <View style={styles.transactionMeta}>
                <Text style={styles.metaText}>{formatDate(transaction.date)}</Text>
                <Text style={styles.metaText}>{transaction.paymentMethod}</Text>
              </View>
            </View>
          </View>
        </Animatable.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 1,
  },
  transactionCard: {
    backgroundColor: '#1E2329',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionCategory: {
    color: '#848E9C',
    fontSize: 14,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionValue: {
    flex: 1,
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionMeta: {
    alignItems: 'flex-end',
  },
  metaText: {
    color: '#848E9C',
    fontSize: 12,
  },
}); 