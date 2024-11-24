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
import { ScrollView } from 'react-native-gesture-handler';

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

    const [responseLoteVencido, fetchDataLoteVencido] = useFetch<{
        arrExpiredLotes: Lote[];
    }>();
    const [responseLoteVencimento, fetchDataLoteVencimento] = useFetch<{
        arrExpiringLotes: Lote[];
    }>();
    const [responseSaida, fetchDataSaida] = useFetch<{
        totalSaidas: any[];
    }>();

    const [lotesVencidos, setLotesVencidos] = useState<Lote[]>([]);
    const [lotesVencimento, setLotesVencimento] = useState<Lote[]>([]);
    const [totalSaidas, setTotalSaidas] = useState<Saida[]>([]);

    const [isLoadingLotesVencidos, setIsLoadingLotesVencidos] = useState(false);
    const [isLoadingLotesVencimento, setIsLoadingLotesVencimento] = useState(false);
    const [isLoadingTotalSaidas, setIsLoadingTotalSaidas] = useState(false);

    const fetchLotesVencidos = async () => {
        if (!empresa?.id) return;
        setIsLoadingLotesVencidos(true);
        const url = `${process.env.EXPO_PUBLIC_API_URL}/lote/vencido?empresa=${empresa.id}`;
        await fetchDataLoteVencido(url, {
            headers: { Authorization: `Bearer ${dataLogin?.token}` },
            method: 'GET',
        });
        setIsLoadingLotesVencidos(false);
    };

    const fetchLotesVencimento = async () => {
        if (!empresa?.id) return;
        setIsLoadingLotesVencimento(true);
        const url = `${process.env.EXPO_PUBLIC_API_URL}/lote/vencimento/7?empresa=${empresa.id}`;
        await fetchDataLoteVencimento(url, {
            headers: { Authorization: `Bearer ${dataLogin?.token}` },
            method: 'GET',
        });
        setIsLoadingLotesVencimento(false);
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
        fetchLotesVencimento();
        fetchLotesTotalSaidas();
    }, [empresa]);

    useEffect(() => {
        if (responseSaida.data?.totalSaidas) {
            setTotalSaidas(responseSaida.data.totalSaidas);
        }
        if (responseLoteVencimento.data?.arrExpiringLotes) {
            setLotesVencimento(responseLoteVencimento.data.arrExpiringLotes);
        }
        if (responseLoteVencido.data?.arrExpiredLotes) {
            setLotesVencidos(responseLoteVencido.data.arrExpiredLotes);
        }
    }, [
        responseSaida.data?.totalSaidas,
        responseLoteVencimento.data?.arrExpiringLotes,
        responseLoteVencido.data?.arrExpiredLotes
    ]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.greetings}>
                {user?.nome ? (
                    <View style={styles.cardVencimentoTitle}>
                        <Text style={styles.h1}>Olá, {user.nome}!</Text>
                    </View>
                ) : (
                    <ActivityIndicator size="large" />
                )}
            </View>

            <View style={styles.cardVencimentoTitle}>
                <Text style={styles.h2}>Total de Saídas</Text>
                <TouchableOpacity style={styles.refresh} onPress={() => fetchLotesTotalSaidas()}>
                    <Feather name="refresh-cw" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {isLoadingTotalSaidas ? (
                <ActivityIndicator size="large" />
            ) : (
                totalSaidas.length ? (
                    <View style={styles.containerView}>
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
                            backgroundColor: "#D4D4D4",
                            backgroundGradientFrom: "#BABABA",
                            backgroundGradientTo: "#D4D4D4",
                            decimalPlaces: 0, // Sem casas decimais
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#D4D4D4"
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

            <View style={styles.cardVencimentoTitle}>
                <Text style={styles.h2}>Lotes a Vencer</Text>
                <TouchableOpacity style={styles.refresh} onPress={() => fetchLotesVencimento()}>
                    <Feather name="refresh-cw" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {isLoadingLotesVencimento ? (
                <ActivityIndicator size="large" />
            ) : (
                lotesVencimento.length ? (
                    <View style={styles.containerView}>
                    {lotesVencimento.map((lote) => (
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
                        <Text style={styles.notFoundText}>Nenhuma lote a vencer encontrado.</Text>
                    </View>
                )
            )}

            <View style={styles.cardVencimentoTitle}>
                <Text style={styles.h2}>Lotes Vencidos</Text>
                <TouchableOpacity style={styles.refresh} onPress={() => fetchLotesVencidos()}>
                    <Feather name="refresh-cw" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {isLoadingLotesVencidos ? (
                <ActivityIndicator size="large" />
            ) : lotesVencidos.length ? (
                <View style={styles.containerView}>
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 32,
        width: '100%',
        height: '100%'
    },
    containerView: {
        marginBottom: 32,
    },
    greetings: {
        marginBottom: 16,
    },
    h1: {
        fontSize: 32,
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
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 32,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    notFoundText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
