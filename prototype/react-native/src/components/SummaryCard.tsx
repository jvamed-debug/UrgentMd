import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Trend = 'up' | 'down' | 'neutral';

type Props = {
  title: string;
  value: string;
  trend: Trend;
};

const trendColors: Record<Trend, string> = {
  up: '#4CAF50',
  down: '#F44336',
  neutral: '#FFC107',
};

const SummaryCard = ({ title, value, trend }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.value}>{value}</Text>
    <Text style={[styles.trend, { color: trendColors[trend] }]}>Trend: {trend}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    color: '#616161',
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginVertical: 4,
  },
  trend: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SummaryCard;
