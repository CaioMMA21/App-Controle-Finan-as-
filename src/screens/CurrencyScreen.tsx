import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Title, useTheme, ActivityIndicator } from 'react-native-paper';

interface Currency {
  code: string;
  name: string;
  value: number;
}

export default function CurrencyScreen() {
  const { colors } = useTheme();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      // Usando uma API pública de câmbio (AwesomeAPI)
      const res = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL');
      const data = await res.json();
      setCurrencies([
        { code: 'USD', name: 'Dólar', value: parseFloat(data.USDBRL.bid) },
        { code: 'EUR', name: 'Euro', value: parseFloat(data.EURBRL.bid) },
        { code: 'BTC', name: 'Bitcoin', value: parseFloat(data.BTCBRL.bid) },
      ]);
    } catch (e) {
      setCurrencies([]);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCurrencies(); }} />}
    >
      <Text style={[styles.title, { color: colors.onBackground }]}>Cotações de Moedas</Text>
      {loading ? (
        <ActivityIndicator animating color={colors.primary} style={{ marginTop: 32 }} />
      ) : (
        currencies.map((c) => (
          <Card key={c.code} style={styles.card}>
            <Card.Content>
              <Title>{c.name} ({c.code})</Title>
              <Text style={styles.value}>R$ {c.value.toFixed(2)}</Text>
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
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
  card: {
    margin: 16,
    marginTop: 8,
    elevation: 4,
    borderRadius: 16,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
}); 