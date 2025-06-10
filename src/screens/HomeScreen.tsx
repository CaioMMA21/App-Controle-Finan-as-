import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, useTheme } from 'react-native-paper';

interface Props {
  balance?: number;
  income?: number;
  expense?: number;
}

export default function HomeScreen({ balance = 0, income = 0, expense = 0 }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <Text style={[styles.title, { color: colors.onBackground }]}>AppFinança</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Saldo Atual</Title>
          <Paragraph style={[styles.balance, { color: colors.primary }]}>R$ {balance.toFixed(2)}</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.row}>
        <Card style={[styles.card, styles.halfCard]}>
          <Card.Content>
            <Title>Receitas</Title>
            <Paragraph style={[styles.income, { color: '#4CAF50' }]}>R$ {income.toFixed(2)}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.halfCard]}>
          <Card.Content>
            <Title>Despesas</Title>
            <Paragraph style={[styles.expense, { color: '#F44336' }]}>R$ {expense.toFixed(2)}</Paragraph>
          </Card.Content>
        </Card>
      </View>
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
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCard: {
    width: '48%',
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  income: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  expense: {
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 