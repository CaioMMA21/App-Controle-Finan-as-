import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';

export default function ReportsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Relatórios</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Resumo do Mês</Title>
          <Paragraph>Receitas: R$ 0,00</Paragraph>
          <Paragraph>Despesas: R$ 0,00</Paragraph>
          <Paragraph>Saldo: R$ 0,00</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Maiores Despesas</Title>
          <Paragraph>Nenhuma despesa registrada</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Maiores Receitas</Title>
          <Paragraph>Nenhuma receita registrada</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Metas Financeiras</Title>
          <Paragraph>Nenhuma meta definida</Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
  },
}); 