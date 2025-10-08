import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import FamilyScreen from '../screens/FamilyScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof MaterialIcons.glyphMap> = {
            Início: 'dashboard',
            Transações: 'list-alt',
            Relatórios: 'pie-chart',
            Família: 'group',
            Configurações: 'settings',
          };

          return <MaterialIcons name={icons[route.name] ?? 'circle'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início" component={DashboardScreen} />
      <Tab.Screen name="Transações" component={TransactionsScreen} />
      <Tab.Screen name="Relatórios" component={ReportsScreen} />
      <Tab.Screen name="Família" component={FamilyScreen} />
      <Tab.Screen name="Configurações" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default RootNavigator;
