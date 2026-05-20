import React from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

export default function FilhosForm({
  visible,
  onClose,
  onSave,
  nome,
  setNome,
  dataNascimento,
  setDataNascimento,
  responsavel,
  setResponsavel,
  editingId,
}: any) {

   // Função para aplicar a máscara de data DD/MM/AAAA automaticamente
  const handleChangeData = (text: string) => {
    // Remove tudo o que não for número
    const apenasNumeros = text.replace(/\D/g, '');
    
    let dataFormatada = apenasNumeros;

    // Insere a primeira barra após o segundo dígito (DD/)
    if (apenasNumeros.length > 2) {
      dataFormatada = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
    }
    // Insere a segunda barra após o quarto dígito (DD/MM/)
    if (apenasNumeros.length > 4) {
      dataFormatada = `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4, 8)}`;
    }

    // Retorna o valor formatado para o estado do componente pai
    setDataNascimento(dataFormatada);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.modalTitle}>
            {editingId ? 'Editar Filho' : 'Novo Filho'}
          </Text>

          <TextInput
            placeholder="Nome do filho"
            placeholderTextColor="#605F5A"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />

          <TextInput
            placeholder="Data de nascimento (DD/MM/AAAA)"
            placeholderTextColor="#605F5A"
            value={dataNascimento}
            onChangeText={handleChangeData} // Função de máscara
            style={styles.input}
            keyboardType="numeric" // Teclado de números
            maxLength={10} 
          />

          <TextInput
            placeholder="Nome do responsável"
            placeholderTextColor="#605F5A"
            value={responsavel}
            onChangeText={setResponsavel}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={onSave}
          >
            <Text style={styles.buttonText}>
              Salvar
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
    marginBottom: 20, 
    textAlign: 'center' 
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