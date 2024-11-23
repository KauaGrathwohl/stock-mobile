import { CardLoteVencimento } from '@/src/components/pages/Home/CardLoteVencimento';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Lote = {
  id: number;
  codigoBarras: string;
  status: string;
  dataFabricacao: string;
  dataVencimento: string;
  produto: {
    id: number;
    descricao: string;
  }
};

export default function Home() {
  const { empresa, dataLogin, user } = useAuth();
  const [response, fetchData] = useFetch<{ arrExpiredLotes: Lote[]; totalSaidas: any[]; arrExpiringLotes: Lote[] }>();
  const [lotesVencidos, setLotesVencidos] = useState<Lote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLotesVencidos = async () => {
    if (!empresa?.id) return;
    setIsLoading(true);
    const url = `${process.env.EXPO_PUBLIC_API_URL}/lote/vencido?empresa=${empresa.id}`;
    await fetchData(url, {
      headers: { Authorization: `Bearer ${dataLogin?.token}` },
      method: 'GET',
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (!empresa) return;
    fetchLotesVencidos();
  }, [empresa]);

  useEffect(() => {
    if (response.data?.arrExpiredLotes) {
      setLotesVencidos(response.data.arrExpiredLotes);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <View style={styles.greetings}>
        {user?.nome ? (
          <Text style={styles.h1}>Olá, {user.nome}!</Text>
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : lotesVencidos.length ? (
        <View>
          <View style={styles.cardVencimentoTitle}>
            <Text style={styles.h2}>Lotes Vencidos</Text>
            <TouchableOpacity style={styles.refresh} onPress={fetchLotesVencidos}>
              <Feather name="refresh-cw" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {lotesVencidos.map((lote) => (
            <CardLoteVencimento
              key={lote.id}
              id={lote.id}
              codigoBarras={lote.codigoBarras}
              status={lote.status}
              dataFabricacao={lote.dataFabricacao}
              dataVencimento={lote.dataVencimento}
              produto={lote.produto}
            />
          ))}
        </View>
      ) : (
        <Text>Nenhum lote vencido encontrado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    width: '100%',
  },
  greetings: {
    marginBottom: 32,
  },
  h1: {
    fontSize: 32,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardVencimentoTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  refresh: {
    marginTop: 8,
  },
});
