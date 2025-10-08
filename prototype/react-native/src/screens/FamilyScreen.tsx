import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SectionTitle from '../components/SectionTitle';

const mockMembers = [
  { id: '1', name: 'Ana Souza', role: 'Administrador', email: 'ana@famfin.com' },
  { id: '2', name: 'Carlos Souza', role: 'Editor', email: 'carlos@famfin.com' },
  { id: '3', name: 'João Souza', role: 'Visualizador', email: 'joao@famfin.com' },
];

const FamilyScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionTitle title="Membros da Família" actionLabel="Convidar" />
      {mockMembers.map((member) => (
        <View style={styles.member} key={member.id}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>{member.name[0]}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{member.name}</Text>
            <Text style={styles.role}>{member.role}</Text>
            <Text style={styles.email}>{member.email}</Text>
          </View>
        </View>
      ))}
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
  member: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  role: {
    fontSize: 13,
    color: '#2196F3',
    marginTop: 4,
  },
  email: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
});

export default FamilyScreen;
