import React from 'react';
import { ScrollView, StyleSheet, View, Text, useColorScheme } from 'react-native';
import SummaryCard from '../components/SummaryCard';
import SectionTitle from '../components/SectionTitle';
import SuggestionsList from '../components/SuggestionsList';

const DashboardScreen = () => {
  const scheme = useColorScheme();
  const backgroundColor = scheme === 'dark' ? '#121212' : '#FFFFFF';

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.balanceLabel}>Saldo Familiar (01-31 Mai 2024)</Text>
      <Text style={styles.balanceValue}>R$ 12.450,00</Text>
      <View style={styles.cardsRow}>
        <SummaryCard title="Receitas" value="R$ 18.000" trend="up" />
        <SummaryCard title="Despesas" value="R$ 5.550" trend="down" />
      </View>
      <View style={styles.cardsRow}>
        <SummaryCard title="Economia" value="R$ 3.500" trend="up" />
        <SummaryCard title="Orçamento" value="65% usado" trend="neutral" />
      </View>
      <SectionTitle title="Insights Inteligentes" actionLabel="Ver todos" />
      <SuggestionsList
        suggestions={[
          {
            id: '1',
            title: 'Aumente a reserva',
            description: 'Reserve 15% da renda para emergências este mês.',
          },
          {
            id: '2',
            title: 'Corte despesas variáveis',
            description: 'Lazer ultrapassou 80% do orçamento. Revise eventos futuros.',
          },
        ]}
      />
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
  balanceLabel: {
    fontSize: 14,
    color: '#616161',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default DashboardScreen;
