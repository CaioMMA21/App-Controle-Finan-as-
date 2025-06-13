import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, useTheme, SegmentedButtons } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { LineChart, PieChart } from 'react-native-chart-kit';

interface TransactionData {
  category: string;
  value: number;
  color: string;
  date: string;
  type: 'income' | 'expense';
}

const mockTransactionData: TransactionData[] = [
  { category: 'Cartão de Crédito', value: 2500, color: '#F0B90B', date: '2024-03-20', type: 'expense' },
  { category: 'PIX', value: 1800, color: '#4CAF50', date: '2024-03-19', type: 'income' },
  { category: 'Dinheiro', value: 1200, color: '#2196F3', date: '2024-03-18', type: 'expense' },
  { category: 'Boleto', value: 800, color: '#9C27B0', date: '2024-03-17', type: 'expense' },
  { category: 'Outros', value: 500, color: '#FF9800', date: '2024-03-16', type: 'income' },
];

type TimeRange = '7D' | '1M' | '3M' | '6M' | '1A' | 'TUDO';

export default function ReportsScreen() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('1M');
  const [filteredData, setFilteredData] = useState<TransactionData[]>(mockTransactionData);
  const [balanceHistory, setBalanceHistory] = useState({
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{ data: [5000, 5500, 4800, 6000, 5800, 6500] }],
  });
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getDateRange = (range: TimeRange) => {
    const today = new Date();
    const startDate = new Date();

    switch (range) {
      case '7D':
        startDate.setDate(today.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(today.getMonth() - 6);
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

  const filterDataByTimeRange = (range: TimeRange) => {
    const { startDate, endDate } = getDateRange(range);
    
    const filtered = mockTransactionData.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    setFilteredData(filtered);
    updateBalanceHistory(filtered, range);
  };

  const updateBalanceHistory = (transactions: TransactionData[], range: TimeRange) => {
    const { startDate, endDate } = getDateRange(range);
    let labels: string[] = [];
    let data: number[] = [];

    if (range === '7D') {
      // Agrupar por dia
      labels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('pt-BR', { weekday: 'short' });
      });
      data = Array(7).fill(0);
      
      transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const dayIndex = 6 - Math.floor((endDate.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayIndex >= 0 && dayIndex < 7) {
          data[dayIndex] += transaction.type === 'income' ? transaction.value : -transaction.value;
        }
      });
    } else if (range === '1M') {
      // Agrupar por dia do mês
      const daysInMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
      data = Array(daysInMonth).fill(0);
      
      transactions.forEach(transaction => {
        const day = new Date(transaction.date).getDate() - 1;
        data[day] += transaction.type === 'income' ? transaction.value : -transaction.value;
      });
    } else {
      // Agrupar por mês
      const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                        endDate.getMonth() - startDate.getMonth() + 1;
      
      labels = Array.from({ length: monthsDiff }, (_, i) => {
        const date = new Date(startDate);
        date.setMonth(startDate.getMonth() + i);
        return date.toLocaleDateString('pt-BR', { month: 'short' });
      });
      
      data = Array(monthsDiff).fill(0);
      
      transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);
        const monthIndex = (transactionDate.getFullYear() - startDate.getFullYear()) * 12 + 
                          transactionDate.getMonth() - startDate.getMonth();
        if (monthIndex >= 0 && monthIndex < monthsDiff) {
          data[monthIndex] += transaction.type === 'income' ? transaction.value : -transaction.value;
        }
      });
    }

    setBalanceHistory({
      labels,
      datasets: [{ data }],
    });
  };

  useEffect(() => {
    filterDataByTimeRange(selectedTimeRange);
  }, [selectedTimeRange]);

  const totalValue = filteredData.reduce((sum, item) => sum + item.value, 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#0B0E11' }]}>
      <Animatable.Text animation="fadeInDown" style={[styles.title, { color: '#FFFFFF' }]}>
        Relatórios
      </Animatable.Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flutuação do Saldo</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={balanceHistory}
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
          buttons={['7D', '1M', '3M', '6M', '1A', 'TUDO'].map(range => ({
            value: range,
            label: range,
          }))}
          style={styles.timeRangeSelector}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distribuição por Método de Pagamento</Text>
        <View style={styles.pieChartContainer}>
          <PieChart
            data={filteredData.map(item => ({
              name: item.category,
              value: item.value,
              color: item.color,
              legendFontColor: '#FFFFFF',
              legendFontSize: 12,
            }))}
            width={screenWidth - 32}
            height={180}
            chartConfig={{
              backgroundColor: '#0B0E11',
              backgroundGradientFrom: '#0B0E11',
              backgroundGradientTo: '#0B0E11',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        </View>

        <View style={styles.legendContainer}>
          {filteredData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <View style={styles.legendText}>
                <Text style={styles.legendLabel}>{item.category}</Text>
                <Text style={styles.legendValue}>
                  {formatCurrency(item.value)} ({((item.value / totalValue) * 100).toFixed(1)}%)
                </Text>
              </View>
            </View>
          ))}
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
  section: {
    backgroundColor: '#1E2329',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
    marginTop: 8,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  legendValue: {
    color: '#848E9C',
    fontSize: 12,
  },
}); 