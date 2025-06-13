import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, useTheme, SegmentedButtons, Button } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'credit_card', name: 'Cartão de Crédito', icon: 'credit-card' },
  { id: 'debit_card', name: 'Cartão de Débito', icon: 'credit-card' },
  { id: 'pix', name: 'PIX', icon: 'cellphone' },
  { id: 'money', name: 'Dinheiro', icon: 'cash' },
  { id: 'bank_transfer', name: 'Transferência', icon: 'bank' },
  { id: 'boleto', name: 'Boleto', icon: 'file-document' },
];

const categories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Outros',
];

export default function AddTransactionScreen() {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { colors } = useTheme();

  const handleSave = () => {
    // Implementar lógica de salvamento
    console.log({
      type,
      description,
      value: parseFloat(value),
      category,
      paymentMethod,
      date,
    });
  };

  const formatCurrency = (text: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Converte para número e divide por 100 para considerar os centavos
    const value = parseFloat(numericValue) / 100;
    
    // Formata o valor como moeda
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#0B0E11' }]}>
      <Animatable.Text animation="fadeInDown" style={[styles.title, { color: '#FFFFFF' }]}>
        Nova Transação
      </Animatable.Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipo de Transação</Text>
        <SegmentedButtons
          value={type}
          onValueChange={(value) => setType(value as 'income' | 'expense')}
          buttons={[
            { value: 'expense', label: 'Despesa' },
            { value: 'income', label: 'Receita' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Valor</Text>
        <TextInput
          mode="outlined"
          value={value}
          onChangeText={(text) => setValue(formatCurrency(text))}
          keyboardType="numeric"
          style={styles.input}
          theme={{ colors: { primary: '#F0B90B' } }}
          outlineColor="#1E2329"
          activeOutlineColor="#F0B90B"
          textColor="#FFFFFF"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descrição</Text>
        <TextInput
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          theme={{ colors: { primary: '#F0B90B' } }}
          outlineColor="#1E2329"
          activeOutlineColor="#F0B90B"
          textColor="#FFFFFF"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                category === cat && styles.selectedCategoryButton
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[
                styles.categoryButtonText,
                category === cat && styles.selectedCategoryButtonText
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
        <View style={styles.paymentMethodsGrid}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodButton,
                paymentMethod === method.id && styles.selectedPaymentMethodButton
              ]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <Text style={[
                styles.paymentMethodText,
                paymentMethod === method.id && styles.selectedPaymentMethodText
              ]}>
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {date.toLocaleDateString('pt-BR')}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveButton}
        buttonColor="#F0B90B"
        textColor="#000000"
      >
        Salvar Transação
      </Button>
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1E2329',
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2C3137',
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#F0B90B',
  },
  categoryButtonText: {
    color: '#FFFFFF',
  },
  selectedCategoryButtonText: {
    color: '#000000',
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paymentMethodButton: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#2C3137',
    marginBottom: 8,
    alignItems: 'center',
  },
  selectedPaymentMethodButton: {
    backgroundColor: '#F0B90B',
  },
  paymentMethodText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  selectedPaymentMethodText: {
    color: '#000000',
  },
  dateButton: {
    backgroundColor: '#2C3137',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 24,
    paddingVertical: 8,
  },
}); 