import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, Divider, useTheme } from 'react-native-paper';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

interface Props {
  transactions?: Transaction[];
}

export default function TransactionsScreen({ transactions = [] }: Props) {
  const { colors } = useTheme();
  const renderTransaction = ({ item }: { item: Transaction }) => (
    <List.Item
      title={item.description}
      description={item.date}
      right={() => (
        <Text style={[
          styles.amount,
          { color: item.type === 'income' ? '#4CAF50' : '#F44336' }
        ]}>
          R$ {Math.abs(item.amount).toFixed(2)}
        </Text>
      )}
    />
  );
  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <Text style={[styles.title, { color: colors.onBackground }]}>Transações</Text>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
}); 