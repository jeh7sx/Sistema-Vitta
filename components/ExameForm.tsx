import React from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

export default function ExameForm({
  visible,
  onClose,
  onSave,
  filhos,
  filhoId,
  setFilhoId,
  tipo,
  setTipo,
  dataExame,
  setDataExame,
  observacoes,
  setObservacoes,
  editingExameId,
}: any) {

  // Função para aplicar a máscara de data DD/MM/AAAA automaticamente
  const handleChangeData = (text: string) => {
    const apenasNumeros = text.replace(/\D/g, '');
    let dataFormatada = apenasNumeros;

    if (apenasNumeros.length > 2) {
      dataFormatada = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
    }
    if (apenasNumeros.length > 4) {
      dataFormatada = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4, 8)}`;
    }

    setDataExame(dataFormatada);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.modalTitle}>
            {editingExameId ? 'Editar Exame' : 'Novo Exame'}
          </Text>

          <Text style={styles.label}>
            Selecionar Filho:
          </Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filhoId}
              onValueChange={(value) => setFilhoId(value)}
              style={{ color: '#1C1C1C' }} 
              dropdownIconColor="#1C1C1C"
            >
              {filhos.map((filho: any) => (
                <Picker.Item
                  key={filho.id}
                  label={filho.nome}
                  value={filho.id}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            placeholder="Tipo do exame"
            placeholderTextColor="#605F5A"
            value={tipo}
            onChangeText={setTipo}
            style={styles.input}
          />

          <TextInput
            placeholder="Data do exame (DD/MM/AAAA)"
            placeholderTextColor="#605F5A"
            value={dataExame}
            onChangeText={handleChangeData} 
            style={styles.input}
            keyboardType="numeric" 
            maxLength={10} 
          />

          <TextInput
            placeholder="Observações"
            placeholderTextColor="#605F5A"
            value={observacoes}
            onChangeText={setObservacoes}
            style={[styles.input, { height: 100 }]}
            multiline
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={onSave}
          >
            <Text style={styles.buttonText}>
              Salvar Exame
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: '#FAF4D0', borderWidth: 1, borderColor: '#FFF6CC' },
            ]}
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: '#605F5A' }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(28, 28, 28, 0.4)',
    padding: 20,
  },
  container: {
    backgroundColor: '#FDFBF0',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FAF4D0',
    shadowColor: '#1C1C1C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  modalTitle: { 
    color: '#1C1C1C',
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center' 
  },
  label: {
    color: '#1C1C1C',
    marginBottom: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  pickerWrapper: {
    backgroundColor: '#FAF4D0',
    // borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFF6CC',
  },
  input: {
    backgroundColor: '#FAF4D0',
    color: '#1C1C1C',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFF6CC',
  },
  button: {
    backgroundColor: '#F4D13B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#1C1C1C',
    fontWeight: 'bold',
  },
});