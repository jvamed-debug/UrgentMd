import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SectionTitle from '../components/SectionTitle';

const TransactionsScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionTitle title="Transações Recentes" actionLabel="Ver filtros" />
      {['Supermercado', 'Combustível', 'Salário', 'Streaming'].map((item, index) => (
        <View style={styles.row} key={item}>
          <View>
            <Text style={styles.title}>{item}</Text>
            <Text style={styles.subtitle}>15 Mai 2024 · Categoria dinâmica</Text>
          </View>
          <Text style={[styles.amount, index === 2 ? styles.income : styles.expense]}>
            {index === 2 ? '+ R$ 8.500,00' : '- R$ 120,00'}
          </Text>
        </View>
      ))}
      <View style={styles.fabPlaceholder}>
        <Text style={styles.fabLabel}>Botão flutuante "+" para nova transação</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    color: '#757575',
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  income: {
    color: '#4CAF50',
  },
  expense: {
    color: '#F44336',
  },
  fabPlaceholder: {
    marginTop: 24,
    padding: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 12,
    alignItems: 'center',
  },
  fabLabel: {
    color: '#2196F3',
    fontWeight: '600',
  },
});

export default TransactionsScreen;
