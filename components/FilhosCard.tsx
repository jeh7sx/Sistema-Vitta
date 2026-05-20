import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function FilhosCard({
  filho,
  onEdit,
  onDelete,
}: any) {
  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>
          {filho.nome}
        </Text>

        <Text style={styles.detalhes}>
          Data de nascimento: {filho.data_nascimento}
        </Text>

        <Text style={styles.detalhes}>
          Responsável: {filho.responsavel}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onEdit}
          style={styles.iconButton}
        >
          <Ionicons
            name="create"
            size={24}
            color="#1C1C1C" 
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          style={styles.iconButton}
        >
          <Ionicons
            name="trash"
            size={24}
            color="#C2410C" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF4D0', 
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FFF6CC', 
    shadowColor: '#1C1C1C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  nome: {
    color: '#1C1C1C', 
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  detalhes: {
    color: '#605F5A',
    fontSize: 14,
    lineHeight: 18,
  },

  actions: {
    flexDirection: 'row',
    gap: 16, 
  },

  iconButton: {
    padding: 4,
  },
});