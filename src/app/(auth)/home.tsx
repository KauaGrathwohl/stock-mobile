import { CardLoteVencimento } from '@/src/components/pages/Home/CardLoteVencimento';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import { Saida } from '@/src/interfaces/api';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

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

    const [responseLote, fetchDataLote] = useFetch<{
        arrExpiredLotes: Lote[];
    }>();
    const [responseSaida, fetchDataSaida] = useFetch<{
        totalSaidas: any[];
    }>();

    const [lotesVencidos, setLotesVencidos] = useState<Lote[]>([]);
    const [totalSaidas, setTotalSaidas] = useState<Saida[]>([]);

    const [isLoadingLotesVencidos, setIsLoadingLotesVencidos] = useState(false);
    const [isLoadingTotalSaidas, setIsLoadingTotalSaidas] = useState(false);

    const fetchLotesVencidos = async () => {
        if (!empresa?.id) return;
        setIsLoadingLotesVencidos(true);
        const url = `${process.env.EXPO_PUBLIC_API_URL}/lote/vencido?empresa=${empresa.id}`;
        await fetchDataLote(url, {
            headers: { Authorization: `Bearer ${dataLogin?.token}` },
            method: 'GET',
        });
        setIsLoadingLotesVencidos(false);
    };

    const fetchLotesTotalSaidas = async () => {
        if (!empresa?.id) return;
        setIsLoadingTotalSaidas(true);
        const url = `${process.env.EXPO_PUBLIC_API_URL}/saidaTotal?empresa=${empresa.id}&dataInicial=2024-01-01&dataFinal=2024-12-31&limit=10`;
        await fetchDataSaida(url, {
            headers: { Authorization: `Bearer ${dataLogin?.token}` },
            method: 'GET',
        });
        setIsLoadingTotalSaidas(false);
    };

    useEffect(() => {
        if (!empresa) return;
        fetchLotesVencidos();
        fetchLotesTotalSaidas();
    }, [empresa]);

    useEffect(() => {
        if (responseSaida.data?.totalSaidas) {
            setTotalSaidas(responseSaida.data.totalSaidas);
        }
        if (responseLote.data?.arrExpiredLotes) {
            setLotesVencidos(responseLote.data.arrExpiredLotes);
        }
    }, [responseSaida.data?.totalSaidas, responseLote.data?.arrExpiredLotes]);

    return (
        <View style={styles.container}>
        <View style={styles.greetings}>
            {user?.nome ? (
                <View style={styles.cardVencimentoTitle}>
                    <Text style={styles.h1}>Olá, {user.nome}!</Text>
                    <TouchableOpacity style={styles.refresh} onPress={fetchLotesVencidos}>
                        <Feather name="refresh-cw" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ) : (
                <ActivityIndicator size="large" />
            )}
        </View>

        {isLoadingTotalSaidas ? (
            <ActivityIndicator size="large" />
        ) : (
            totalSaidas.length ? (
                <View style={styles.containerView}>
                    <View style={styles.cardVencimentoTitle}>
                        <Text style={styles.h2}>Total de Saídas</Text>
                    </View>
                    <LineChart
                    data={{
                        labels: totalSaidas.map((saida) => saida?.produto ?? ''),
                        datasets: [
                            {
                                data: totalSaidas.map((saida) => (saida?.quantidade ?? 0)),
                            },
                        ],
                    }}
                    width={Dimensions.get("window").width - 32} // Largura do gráfico
                    height={220} // Altura do gráfico
                    yAxisLabel="" // Prefixo opcional no eixo Y
                    yAxisSuffix="" // Sufixo opcional no eixo Y
                    yAxisInterval={1} // Intervalo do eixo Y
                    chartConfig={{
                        backgroundColor: "#e26a00",
                        backgroundGradientFrom: "#fb8c00",
                        backgroundGradientTo: "#ffa726",
                        decimalPlaces: 0, // Sem casas decimais
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        },
                        propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                    />
                </View>
            ) : (
                <View style={styles.notFound}>
                    <Text style={styles.notFoundText}>Nenhuma saída encontrada.</Text>
                </View>
            )
        )}

        {isLoadingLotesVencidos ? (
            <ActivityIndicator size="large" />
        ) : lotesVencidos.length ? (
            <View style={styles.containerView}>
                <View style={styles.cardVencimentoTitle}>
                    <Text style={styles.h2}>Lotes Vencidos</Text>
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
            <View style={styles.notFound}>
                <Text style={styles.notFoundText}>Nenhum lote vencido encontrado.</Text>
            </View>
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
    containerView: {
        marginBottom: 32,
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
    notFound: {
        alignSelf: 'center', // Centraliza horizontalmente
        backgroundColor: '#f0ad4e', // Cor de fundo (personalize conforme desejar)
        paddingHorizontal: 16, // Espaçamento interno horizontal
        paddingVertical: 8, // Espaçamento interno vertical
        borderRadius: 8, // Borda arredondada
        marginBottom: 16,
    },
    notFoundText: {
        fontSize: 16, // Tamanho de fonte moderado
        fontWeight: '600', // Fonte mais evidente
        color: '#fff', // Texto branco
        textAlign: 'center', // Centraliza o texto dentro do card
    },
});
