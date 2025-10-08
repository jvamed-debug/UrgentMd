import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import SectionTitle from '../components/SectionTitle';

const SettingsScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionTitle title="Configurações" />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências Gerais</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Tema escuro automático</Text>
          <Switch value={true} onValueChange={() => undefined} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Idioma</Text>
          <Text style={styles.value}>Português (Brasil)</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Segurança</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Autenticação biométrica</Text>
          <Switch value={true} onValueChange={() => undefined} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Notificações de orçamento</Text>
          <Switch value={true} onValueChange={() => undefined} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assinatura</Text>
        <Text style={styles.label}>Plano atual: Gratuito · Upgrade para Premium por R$ 9,99/mês</Text>
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
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: '#212121',
    flex: 1,
    paddingRight: 12,
  },
  value: {
    fontSize: 15,
    color: '#616161',
  },
});

export default SettingsScreen;
