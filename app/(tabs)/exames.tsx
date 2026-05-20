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

import ExameCard from '../../components/ExameCard';
import ExameForm from '../../components/ExameForm'; 
import EmptyState from '../../components/EmptyState';

const EXAMES_KEY = '@sistema_vitta:filhos_exames';
const FILHOS_KEY = '@sistema_vitta:filhos';

let useSQLiteContext: any = () => null;
if (Platform.OS !== 'web') {
  useSQLiteContext = require('expo-sqlite').useSQLiteContext;
}

export default function ExamesScreen() {
  const db = Platform.OS !== 'web' ? useSQLiteContext() : null;

  const [exames, setExames] = useState<any[]>([]);
  const [filhos, setFilhos] = useState<any[]>([]);

  const [modalVisible, setModalVisible] = useState(false);

  const [tipo, setTipo] = useState('');
  const [dataExame, setDataExame] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [filhoId, setFilhoId] = useState<number | string>(0);
  
  const [editingExameId, setEditingExameId] = useState<number | null>(null);

  async function loadData() {
    if (Platform.OS === 'web') {
      try {
        const storedFilhos = await AsyncStorage.getItem(FILHOS_KEY);
        const storedExames = await AsyncStorage.getItem(EXAMES_KEY);

        const listaFilhos = storedFilhos ? JSON.parse(storedFilhos) : [];
        const listaExamesRaw = storedExames ? JSON.parse(storedExames) : [];

        const listaExamesMapeada = listaExamesRaw.map((exame: any) => {
          const filhoCorrespondente = listaFilhos.find((f: any) => Number(f.id) === Number(exame.id_filho));
          return {
            ...exame,
            filho_nome: filhoCorrespondente ? filhoCorrespondente.nome : 'Desconhecido',
          };
        });

        setFilhos(listaFilhos);
        setExames(listaExamesMapeada);

        if (listaFilhos.length > 0 && !filhoId) {
          setFilhoId(listaFilhos[0].id);
        }
      } catch (error) {
        console.error('Erro ao ler AsyncStorage nos Exames:', error);
      }
      return;
    }

    try {
      const examesResult = await db.getAllAsync(`
        SELECT exames.*, filhos.nome as child_name
        FROM exames
        JOIN filhos ON filhos.id = exames.id_filho
      `);

      const examesTratados = examesResult.map((e: any) => ({
        ...e,
        filho_nome: e.child_name || e.filho_nome
      }));

      const filhosResult = await db.getAllAsync('SELECT * FROM filhos');

      setExames(examesTratados);
      setFilhos(filhosResult);

      if (filhosResult.length > 0 && !filhoId) {
        setFilhoId((filhosResult[0] as any).id);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveExame() {
    if (!tipo.trim() || !filhoId) {
      Alert.alert('Erro', 'Preencha o tipo do exame e selecione um filho.');
      return;
    }

    // Formata data em DD/MM/AAAA
    if (dataExame.trim() && dataExame.length < 10) {
      Alert.alert('Atenção', 'Digite uma data de exame válida (DD/MM/AAAA) ou deixe em branco.');
      return;
    }

    if (Platform.OS === 'web') {
      try {
        const storedExames = await AsyncStorage.getItem(EXAMES_KEY);
        let listaExames = storedExames ? JSON.parse(storedExames) : [];

        if (editingExameId) {
          listaExames = listaExames.map((e: any) =>
            e.id === editingExameId
              ? { ...e, tipo, data_exame: dataExame, observacoes, id_filho: Number(filhoId) }
              : e
          );
        } else {
          const novoExame = {
            id: Date.now(),
            tipo,
            data_exame: dataExame,
            observacoes,
            id_filho: Number(filhoId),
          };
          listaExames.push(novoExame);
        }

        await AsyncStorage.setItem(EXAMES_KEY, JSON.stringify(listaExames));
        closeModal();
        loadData();
      } catch (error) {
        console.error('Erro ao salvar exame na Web:', error);
      }
      return;
    }

    try {
      if (editingExameId) {
        await db.runAsync(
          `UPDATE exames SET tipo=?, data_exame=?, observacoes=?, id_filho=? WHERE id=?`,
          [tipo, dataExame, observacoes, filhoId, editingExameId]
        );
      } else {
        await db.runAsync(
          `INSERT INTO exames(tipo, data_exame, observacoes, id_filho) VALUES (?, ?, ?, ?)`,
          [tipo, dataExame, observacoes, filhoId]
        );
      }

      closeModal();
      loadData();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao salvar exame no dispositivo.');
    }
  }

  function handleEditExame(exame: any) {
    setEditingExameId(exame.id);
    setTipo(exame.tipo);
    setDataExame(exame.data_exame);
    setObservacoes(exame.observacoes);
    setFilhoId(exame.id_filho);
    setModalVisible(true);
  }

  function closeModal() {
    setEditingExameId(null);
    setTipo('');
    setDataExame('');
    setObservacoes('');
    if (filhos.length > 0) {
      setFilhoId(filhos[0].id);
    }
    setModalVisible(false);
  }

  async function deleteExame(id: number) {
    const executarExclusao = async () => {
      if (Platform.OS === 'web') {
        try {
          const storedExames = await AsyncStorage.getItem(EXAMES_KEY);
          if (storedExames) {
            const listaFiltrada = JSON.parse(storedExames).filter((e: any) => e.id !== id);
            await AsyncStorage.setItem(EXAMES_KEY, JSON.stringify(listaFiltrada));
            loadData();
          }
        } catch (error) {
          console.error('Erro ao deletar exame na Web:', error);
        }
        return;
      }

      await db.runAsync('DELETE FROM exames WHERE id=?', [id]);
      loadData();
    };

    if (Platform.OS === 'web') {
      if (confirm('Deseja excluir este exame?')) {
        executarExclusao();
      }
    } else {
      Alert.alert('Excluir', 'Deseja excluir este exame?', [
        { text: 'Cancelar' },
        { text: 'Excluir', style: 'destructive', onPress: executarExclusao },
      ]);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exames</Text>

      <FlatList
        data={exames}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExameCard 
            exame={item} 
            onEdit={() => handleEditExame(item)} 
            onDelete={() => deleteExame(item.id)} 
          />
        )}
        ListEmptyComponent={<EmptyState text="Nenhum exame cadastrado" />}
      />

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.fab}>
        <Text style={{ color: '#1C1C1C', fontSize: 32 }}>+</Text>
      </TouchableOpacity>

      <ExameForm
        visible={modalVisible}
        onClose={closeModal}
        onSave={saveExame}
        filhos={filhos}
        filhoId={filhoId}
        setFilhoId={setFilhoId}
        tipo={tipo}
        setTipo={setTipo}
        dataExame={dataExame}
        setDataExame={setDataExame}
        observacoes={observacoes}
        setObservacoes={setObservacoes}
        editingExameId={editingExameId}
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
    shadowColor: '#1C1C1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
});