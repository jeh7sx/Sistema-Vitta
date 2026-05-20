import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FilhosCard from '../../components/FilhosCard';
import FilhosForm from '../../components/FilhosForm';
import EmptyState from '../../components/EmptyState';

const ASYNC_STORAGE_KEY = '@sistema_vitta:filhos';

let useSQLiteContext: any = () => null;
if (Platform.OS !== 'web') {
  useSQLiteContext = require('expo-sqlite').useSQLiteContext;
}

export default function FilhosScreen() {
  const db = Platform.OS !== 'web' ? useSQLiteContext() : null;

  const [filhos, setFilhos] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [responsavel, setResponsavel] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadFilhos() {
    if (Platform.OS === 'web') {
      try {
        const storedData = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
        if (storedData) {
          setFilhos(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Erro ao ler AsyncStorage:', error);
      }
      return;
    }

    try {
      const result = await db.getAllAsync('SELECT * FROM filhos');
      setFilhos(result);
    } catch (error) {
      console.error('Erro ao carregar filhos:', error);
    }
  }

  useEffect(() => {
    loadFilhos();
  }, []);

  async function saveFilho() {
    if (!nome.trim() || !dataNascimento.trim() || !responsavel.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    if (Platform.OS === 'web') {
      try {
        let listaAtualizada = [...filhos];

        if (editingId) {
          listaAtualizada = listaAtualizada.map(f => 
            f.id === editingId ? { id: editingId, nome, data_nascimento: dataNascimento, responsavel } : f
          );
        } else {
          const novoFilho = {
            id: Date.now(),
            nome,
            data_nascimento: dataNascimento,
            responsavel,
          };
          listaAtualizada.push(novoFilho);
        }

        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(listaAtualizada));
        setFilhos(listaAtualizada);
        closeModal();
      } catch (error) {
        console.error('Erro ao salvar no AsyncStorage:', error);
      }
      return;
    }

    try {
      if (editingId) {
        await db.runAsync(
          `UPDATE filhos SET nome=?, data_nascimento=?, responsavel=? WHERE id=?`,
          [nome, dataNascimento, responsavel, editingId]
        );
      } else {
        await db.runAsync(
          `INSERT INTO filhos(nome, data_nascimento, responsavel) VALUES (?, ?, ?)`,
          [nome, dataNascimento, responsavel]
        );
      }
      closeModal();
      loadFilhos();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  }

  async function deleteFilho(id: number) {
    const executarExclusao = async () => {
      if (Platform.OS === 'web') {
        const listaFiltrada = filhos.filter(f => f.id !== id);
        await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(listaFiltrada));
        setFilhos(listaFiltrada);
        
        const examesSalvos = await AsyncStorage.getItem('@sistema_vitta:exames');
        if (examesSalvos) {
          const examesFiltrados = JSON.parse(examesSalvos).filter((e: any) => e.id_filho !== id);
          await AsyncStorage.setItem('@sistema_vitta:exames', JSON.stringify(examesFiltrados));
        }
        return;
      }

      await db.runAsync('DELETE FROM filhos WHERE id=?', [id]);
      loadFilhos();
    };

    if (Platform.OS === 'web') {
      if (confirm('Deseja realmente excluir este filho e seus exames?')) {
        executarExclusao();
      }
    } else {
      Alert.alert('Excluir', 'Deseja realmente excluir este filho e seus exames?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: executarExclusao },
      ]);
    }
  }

  function closeModal() {
    setNome('');
    setDataNascimento('');
    setResponsavel('');
    setEditingId(null);
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sistema Vitta</Text>

      <FlatList
        data={filhos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FilhosCard
            filho={item}
            onEdit={() => {
              setEditingId(item.id);
              setNome(item.nome);
              setDataNascimento(item.data_nascimento);
              setResponsavel(item.responsavel);
              setModalVisible(true);
            }}
            onDelete={() => deleteFilho(item.id)}
          />
        )}
        ListEmptyComponent={<EmptyState text="Nenhum filho cadastrado" />}
      />

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.fab}>
        <Text style={{ color: '#1C1C1C', fontSize: 32 }}>+</Text>
      </TouchableOpacity>

      <FilhosForm
        visible={modalVisible}
        onClose={closeModal}
        onSave={saveFilho}
        nome={nome}
        setNome={setNome}
        dataNascimento={dataNascimento}
        setDataNascimento={setDataNascimento}
        responsavel={responsavel}
        setResponsavel={setResponsavel}
        editingId={editingId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FDFBF0', 
    padding: 16 
  },
  title: { 
    color: '#1C1C1C', 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    marginTop: 40 
  },
  fab: {
    position: 'absolute', 
    bottom: 30, 
    right: 30, 
    width: 60, 
    height: 60, 
    borderRadius: 30,
    backgroundColor: '#F4D13B', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 5,
    shadowColor: '#1C1C1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});