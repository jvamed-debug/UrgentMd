import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type Suggestion = {
  id: string;
  title: string;
  description: string;
};

type Props = {
  suggestions: Suggestion[];
};

const SuggestionsList = ({ suggestions }: Props) => (
  <FlatList
    data={suggestions}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0D47A1',
  },
  description: {
    fontSize: 14,
    color: '#1A237E',
  },
});

export default SuggestionsList;
