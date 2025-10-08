import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

const SectionTitle = ({ title, actionLabel, onPressAction }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {actionLabel ? (
      <TouchableOpacity onPress={onPressAction}>
        <Text style={styles.action}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  action: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '500',
  },
});

export default SectionTitle;
