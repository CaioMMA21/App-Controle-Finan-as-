import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Text, useTheme, IconButton, Portal, Menu } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface Props {
  balance?: number;
  income?: number;
  expense?: number;
}

interface Transaction {
  id: string;
  description: string;
  value: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  paymentMethod: string;
}

const screenWidth = Dimensions.get('window').width;

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

type PeriodType = 'Hoje' | '7 dias' | 'Mês' | 'Ano';

export default function HomeScreen({ balance = 0, income = 0, expense = 0 }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('Mês');
  const [menuVisible, setMenuVisible] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(mockTransactions);
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [{ data: [20, 45, 28, 80, 99, 43] }],
  });
  const { colors } = useTheme();

  const formatCurrency = (value: number) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getDateRange = (period: PeriodType) => {
    const today = new Date();
    const startDate = new Date();

    switch (period) {
      case 'Hoje':
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7 dias':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'Mês':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Ano':
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    return { startDate, endDate: today };
  };

  const filterTransactionsByPeriod = (period: PeriodType) => {
    const { startDate, endDate } = getDateRange(period);
    
    const filtered = mockTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    setFilteredTransactions(filtered);
    updateChartData(filtered, period);
  };

  const updateChartData = (transactions: Transaction[], period: PeriodType) => {
    const { startDate, endDate } = getDateRange(period);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let labels: string[] = [];
    let data: number[] = [];

    if (period === 'Hoje') {
      // Agrupar por hora
      labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      data = Array(24).fill(0);
      
      transactions.forEach(transaction => {
        const hour = new Date(transaction.date).getHours();
        data[hour] += transaction.type === 'income' ? transaction.value : -transaction.value;
      });
    } else if (period === '7 dias') {
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
    } else if (period === 'Mês') {
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
      labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      data = Array(12).fill(0);
      
      transactions.forEach(transaction => {
        const month = new Date(transaction.date).getMonth();
        data[month] += transaction.type === 'income' ? transaction.value : -transaction.value;
      });
    }

    setChartData({
      labels,
      datasets: [{ data }],
    });
  };

  useEffect(() => {
    filterTransactionsByPeriod(selectedPeriod);
  }, [selectedPeriod]);

  const calculatePeriodTotals = (transactions: Transaction[]) => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.value;
      } else {
        acc.expense += transaction.value;
      }
      return acc;
    }, { income: 0, expense: 0 });
  };

  const periodTotals = calculatePeriodTotals(filteredTransactions);

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#0B0E11' }]}>
      <View style={styles.header}>
        <Animatable.Text animation="fadeInDown" style={[styles.title, { color: '#FFFFFF' }]}>
          AppFinança
        </Animatable.Text>
        <IconButton
          icon="bell-outline"
          iconColor="#FFFFFF"
          size={24}
          onPress={() => {}}
        />
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Saldo Total</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity 
                style={styles.periodSelector}
                onPress={() => setMenuVisible(true)}
              >
                <Text style={styles.periodText}>{selectedPeriod}</Text>
                <IconButton
                  icon="chevron-down"
                  iconColor="#FFFFFF"
                  size={20}
                  onPress={() => setMenuVisible(true)}
                />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => { setSelectedPeriod('Hoje'); setMenuVisible(false); }} title="Hoje" />
            <Menu.Item onPress={() => { setSelectedPeriod('7 dias'); setMenuVisible(false); }} title="Últimos 7 dias" />
            <Menu.Item onPress={() => { setSelectedPeriod('Mês'); setMenuVisible(false); }} title="Este mês" />
            <Menu.Item onPress={() => { setSelectedPeriod('Ano'); setMenuVisible(false); }} title="Este ano" />
          </Menu>
        </View>
        <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
        
        <View style={styles.balanceDetails}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceItemLabel}>Receitas</Text>
            <Text style={[styles.balanceItemValue, { color: '#4CAF50' }]}>
              {formatCurrency(periodTotals.income)}
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceItemLabel}>Despesas</Text>
            <Text style={[styles.balanceItemValue, { color: '#F44336' }]}>
              {formatCurrency(periodTotals.expense)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Evolução do Saldo</Text>
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

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <IconButton
              icon="plus"
              iconColor="#000000"
              size={24}
              onPress={() => {}}
            />
          </View>
          <Text style={styles.actionText}>Nova Receita</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: '#F44336' }]}>
            <IconButton
              icon="minus"
              iconColor="#FFFFFF"
              size={24}
              onPress={() => {}}
            />
          </View>
          <Text style={styles.actionText}>Nova Despesa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <View style={[styles.actionIcon, { backgroundColor: '#2196F3' }]}>
            <IconButton
              icon="transfer"
              iconColor="#FFFFFF"
              size={24}
              onPress={() => {}}
            />
          </View>
          <Text style={styles.actionText}>Transferir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentTransactions}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transações Recentes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {filteredTransactions.map((transaction, index) => (
          <Animatable.View
            key={transaction.id}
            animation="fadeInUp"
            delay={index * 100}
          >
            <View style={styles.transactionCard}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionCategory}>{transaction.category}</Text>
              </View>
              <View style={styles.transactionValue}>
                <Text style={[
                  styles.valueText,
                  { color: transaction.type === 'income' ? '#4CAF50' : '#F44336' }
                ]}>
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.value)}
                </Text>
                <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
              </View>
            </View>
          </Animatable.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  balanceCard: {
    backgroundColor: '#1E2329',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    color: '#848E9C',
    fontSize: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flex: 1,
  },
  balanceItemLabel: {
    color: '#848E9C',
    fontSize: 14,
  },
  balanceItemValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartSection: {
    backgroundColor: '#1E2329',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    marginBottom: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  recentTransactions: {
    backgroundColor: '#1E2329',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#F0B90B',
    fontSize: 14,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2C3137',
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
  transactionValue: {
    alignItems: 'flex-end',
  },
  valueText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    color: '#848E9C',
    fontSize: 12,
  },
}); 