import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FDFBF0',
          borderTopWidth: 1,
          borderTopColor: '#FAF4D0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#F4D13B',   
        tabBarInactiveTintColor: '#605F5A', 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="filhos"
        options={{
          title: 'Filhos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="exames"
        options={{
          title: 'Exames',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}