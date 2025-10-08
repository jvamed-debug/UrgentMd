import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SectionTitle from '../components/SectionTitle';

const ReportsScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionTitle title="Relatórios" actionLabel="Exportar PDF" />
      <View style={styles.chartPlaceholder}>
        <Text style={styles.chartTitle}>Pizza: Gastos por Categoria</Text>
      </View>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.chartTitle}>Barras: Fluxo de Caixa Mensal</Text>
      </View>
      <View style={styles.chartPlaceholder}>
        <Text style={styles.chartTitle}>Linha: Projeção de Saldo</Text>
      </View>
      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitle}>Sugestão</Text>
        <Text style={styles.tipsDescription}>
          Ajuste a categoria "Lazer" para 10% da renda familiar para equilibrar despesas variáveis.
        </Text>
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
  chartPlaceholder: {
    height: 180,
    borderRadius: 16,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#283593',
  },
  tipsBox: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#F57C00',
  },
  tipsDescription: {
    fontSize: 14,
    color: '#BF360C',
    lineHeight: 20,
  },
});

export default ReportsScreen;
