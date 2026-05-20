import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  
  // Animação de entrada do painel
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
      
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/*Boas-Vindas */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Olá! Seja bem-vindo ao</Text>
        <Text style={styles.brandText}>Vitta</Text>
        <Text style={styles.subtitle}>Gerencie o histórico de saúde de seu filho em um só lugar.</Text>
      </View>

      {/* Grid de Atalhos Rápidos */}
      <Animated.View style={[styles.menuGrid, { opacity: fadeAnim }]}>
        
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push('/filhos')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
            <Ionicons name="people" size={32} color="#8B5CF6" />
          </View>
          <Text style={styles.cardTitle}>Filhos</Text>
          <Text style={styles.cardDescription}>Cadastre seus filhos e gerencie dados pessoais.</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push('/exames')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <Ionicons name="document-text" size={32} color="#10B981" />
          </View>
          <Text style={styles.cardTitle}>Exames</Text>
          <Text style={styles.cardDescription}>Adicione exames, relatórios e controle históricos.</Text>
        </TouchableOpacity>

      </Animated.View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF0', 
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  welcomeText: {
    color: '#605F5A',
    fontSize: 16,
    fontWeight: '500',
  },
  brandText: {
    color: '#1C1C1C', 
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    marginVertical: 4,
  },
  subtitle: {
    color: '#605F5A', 
    fontSize: 15,
    marginTop: 6,
    lineHeight: 22,
  },
  menuGrid: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FAF4D0',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#FFF6CC',
    shadowColor: '#1C1C1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFF6CC', 
  },
  cardTitle: {
    color: '#1C1C1C', 
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardDescription: {
    color: '#605F5A', 
    fontSize: 14,
    lineHeight: 20,
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 40,
  },
 
});