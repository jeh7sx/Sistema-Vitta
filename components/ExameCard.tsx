import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExameCard({
  exame,
  onEdit,
  onDelete,
}: any) {
  return (
    <View
      style={{
        backgroundColor: '#FAF4D0', 
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#FFF6CC',
        shadowColor: '#1C1C1C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      }}
    >
      <Text
        style={{
          color: '#1C1C1C', 
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        {exame.tipo}
      </Text>

      <Text style={{ color: '#605F5A', marginTop: 6, fontWeight: '500' }}>
        Filho: {exame.filho_nome}
      </Text>

      <Text style={{ color: '#605F5A' }}>
        Data: {exame.data_exame || 'Não informada'}
      </Text>

      {!!exame.observacoes && (
        <Text
          style={{
            color: '#605F5A', 
            marginTop: 8,
            fontSize: 14,
            lineHeight: 18,
          }}
        >
          Observações: {exame.observacoes}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          marginTop: 12,
          gap: 16, 
        }}
      >
        <TouchableOpacity onPress={onEdit}>
          <Ionicons
            name="create"
            size={24}
            color="#1C1C1C" 
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={onDelete}>
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