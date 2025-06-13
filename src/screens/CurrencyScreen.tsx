import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card, Title, Paragraph, useTheme, SegmentedButtons } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { LineChart } from 'react-native-chart-kit';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  chartData: {
    date: string;
    price: number;
  }[];
}

const mockCryptos: Crypto[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 45000,
    change24h: 2.5,
    marketCap: 850000000000,
    volume24h: 25000000000,
    chartData: [
      { date: '2024-03-20', price: 45000 },
      { date: '2024-03-19', price: 44800 },
      { date: '2024-03-18', price: 44200 },
      { date: '2024-03-17', price: 42800 },
      { date: '2024-03-16', price: 43500 },
      { date: '2024-03-15', price: 42000 },
      { date: '2024-03-14', price: 41500 },
    ]
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3000,
    change24h: -1.2,
    marketCap: 350000000000,
    volume24h: 15000000000,
    chartData: [
      { date: '2024-03-20', price: 3000 },
      { date: '2024-03-19', price: 3010 },
      { date: '2024-03-18', price: 3020 },
      { date: '2024-03-17', price: 2980 },
      { date: '2024-03-16', price: 3050 },
      { date: '2024-03-15', price: 3100 },
      { date: '2024-03-14', price: 3080 },
    ]
  },
  {
    id: '3',
    name: 'BNB',
    symbol: 'BNB',
    price: 400,
    change24h: 0.8,
    marketCap: 65000000000,
    volume24h: 2000000000,
    chartData: [
      { date: '2024-03-20', price: 400 },
      { date: '2024-03-19', price: 401 },
      { date: '2024-03-18', price: 402 },
      { date: '2024-03-17', price: 398 },
      { date: '2024-03-16', price: 395 },
      { date: '2024-03-15', price: 390 },
      { date: '2024-03-14', price: 385 },
    ]
  },
  {
    id: '4',
    name: 'Solana',
    symbol: 'SOL',
    price: 120,
    change24h: 5.2,
    marketCap: 45000000000,
    volume24h: 3000000000,
    chartData: [
      { date: '2024-03-20', price: 120 },
      { date: '2024-03-19', price: 121 },
      { date: '2024-03-18', price: 122 },
      { date: '2024-03-17', price: 118 },
      { date: '2024-03-16', price: 115 },
      { date: '2024-03-15', price: 110 },
      { date: '2024-03-14', price: 105 },
    ]
  },
  {
    id: '5',
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.45,
    change24h: -2.1,
    marketCap: 15000000000,
    volume24h: 800000000,
    chartData: [
      { date: '2024-03-20', price: 0.45 },
      { date: '2024-03-19', price: 0.44 },
      { date: '2024-03-18', price: 0.45 },
      { date: '2024-03-17', price: 0.44 },
      { date: '2024-03-16', price: 0.45 },
      { date: '2024-03-15', price: 0.46 },
      { date: '2024-03-14', price: 0.47 },
    ]
  }
];

type TimeRange = '24H' | '7D' | '1M' | '3M' | '1A' | 'TUDO';

export default function CurrencyScreen() {
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto>(mockCryptos[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('24H');
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({
    labels: [],
    datasets: [{ data: [] }]
  });
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1000000000) {
      return `R$ ${(value / 1000000000).toFixed(2)}B`;
    }
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(2)}M`;
    }
    return `R$ ${value.toLocaleString()}`;
  };

  const getDateRange = (range: TimeRange) => {
    const today = new Date();
    const startDate = new Date();

    switch (range) {
      case '24H':
        startDate.setHours(today.getHours() - 24);
        break;
      case '7D':
        startDate.setDate(today.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case '1A':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case 'TUDO':
        startDate.setFullYear(2020); // Data inicial do app
        break;
    }

    return { startDate, endDate: today };
  };

  const updateChartData = (crypto: Crypto, range: TimeRange) => {
    const { startDate, endDate } = getDateRange(range);
    
    const filteredData = crypto.chartData.filter(point => {
      const pointDate = new Date(point.date);
      return pointDate >= startDate && pointDate <= endDate;
    });

    let labels: string[] = [];
    let data: number[] = [];

    if (range === '24H') {
      // Agrupar por hora
      labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      data = Array(24).fill(null);
      
      filteredData.forEach(point => {
        const hour = new Date(point.date).getHours();
        data[hour] = point.price;
      });
    } else if (range === '7D') {
      // Agrupar por dia
      labels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('pt-BR', { weekday: 'short' });
      });
      data = Array(7).fill(null);
      
      filteredData.forEach(point => {
        const pointDate = new Date(point.date);
        const dayIndex = 6 - Math.floor((endDate.getTime() - pointDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayIndex >= 0 && dayIndex < 7) {
          data[dayIndex] = point.price;
        }
      });
    } else {
      // Agrupar por data
      labels = filteredData.map(point => 
        new Date(point.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
      );
      data = filteredData.map(point => point.price);
    }

    // Após montar o array data, sanitize:
    const sanitizedData = data.map(v => (Number.isFinite(v) ? v : 0));
    setChartData({
      labels,
      datasets: [{ data: sanitizedData }],
    });
  };

  useEffect(() => {
    updateChartData(selectedCrypto, selectedTimeRange);
  }, [selectedCrypto, selectedTimeRange]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#0B0E11' }]}>
      <Animatable.Text animation="fadeInDown" style={[styles.title, { color: '#FFFFFF' }]}>
        Criptomoedas
      </Animatable.Text>

      <View style={styles.cryptoSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mockCryptos.map((crypto) => (
            <TouchableOpacity
              key={crypto.id}
              style={[
                styles.cryptoButton,
                selectedCrypto.id === crypto.id && styles.selectedCryptoButton
              ]}
              onPress={() => setSelectedCrypto(crypto)}
            >
              <Text style={[
                styles.cryptoButtonText,
                selectedCrypto.id === crypto.id && styles.selectedCryptoButtonText
              ]}>
                {crypto.symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.selectedCryptoInfo}>
        <View style={styles.cryptoHeader}>
          <View>
            <Text style={styles.cryptoName}>{selectedCrypto.name}</Text>
            <Text style={styles.cryptoPrice}>{formatCurrency(selectedCrypto.price)}</Text>
          </View>
          <Text style={[
            styles.changeText,
            { color: selectedCrypto.change24h >= 0 ? '#4CAF50' : '#F44336' }
          ]}>
            {selectedCrypto.change24h >= 0 ? '+' : ''}{selectedCrypto.change24h}%
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={180}
            chartConfig={{
              backgroundColor: '#0B0E11',
              backgroundGradientFrom: '#0B0E11',
              backgroundGradientTo: '#0B0E11',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(240, 185, 11, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#F0B90B'
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <SegmentedButtons
          value={selectedTimeRange}
          onValueChange={(value) => setSelectedTimeRange(value as TimeRange)}
          buttons={['24H', '7D', '1M', '3M', '1A', 'TUDO'].map(range => ({
            value: range,
            label: range,
          }))}
          style={styles.timeRangeSelector}
        />

        <View style={styles.cryptoStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Cap. de Mercado</Text>
            <Text style={styles.statValue}>{formatLargeNumber(selectedCrypto.marketCap)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Volume 24h</Text>
            <Text style={styles.statValue}>{formatLargeNumber(selectedCrypto.volume24h)}</Text>
          </View>
        </View>
      </View>
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
  cryptoSelector: {
    marginBottom: 16,
  },
  cryptoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E2329',
    marginRight: 8,
  },
  selectedCryptoButton: {
    backgroundColor: '#F0B90B',
  },
  cryptoButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectedCryptoButtonText: {
    color: '#000000',
  },
  selectedCryptoInfo: {
    backgroundColor: '#1E2329',
    borderRadius: 16,
    padding: 16,
  },
  cryptoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cryptoName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cryptoPrice: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 4,
  },
  changeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  timeRangeSelector: {
    marginBottom: 16,
  },
  cryptoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: '#848E9C',
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 