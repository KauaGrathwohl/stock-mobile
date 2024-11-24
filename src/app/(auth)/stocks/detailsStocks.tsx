import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Alert } from 'react-native';
import { Actions } from '@/src/components/common/Actions';
import { Button } from '@/src/components/common/Button';
import { ModalExclude } from '@/src/components/common/ModalExclude';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import { useFocusEffect } from '@react-navigation/native';
import { Lote } from '@/src/interfaces/api';

export interface LoteResponse {
    lote: Lote;
}

export const DetailsStocks = ({ route, navigation }: { route: any; navigation: any }) => {
    const { stock: initialStock } = route.params;
    const { empresa, dataLogin } = useAuth();
    const [responseDeleteStock, fetchDataDeleteStock] = useFetch();
    const [responseGetStockById, fetchDataGetStockById] = useFetch<LoteResponse>();

    const [loading, setLoading] = useState<boolean>(true);
    const [stockKeys, setStockKeys] = useState<(keyof Lote)[]>([]);
    const [stock, setStock] = useState<Lote>(initialStock);
    const [modalVisible, setModalVisible] = useState(false);

    const handleCancel = () => setModalVisible(false);

    const handleConfirm = async () => {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/lote/${stock.id}?empresa=${empresa?.id}`;
        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            'Content-Type': 'application/json',
        };

        try {
            await fetchDataDeleteStock(url, { headers, method: 'DELETE' });
            if (responseDeleteStock?.error) return Alert.alert('Erro', 'Não foi possível excluir o lote.');
            Alert.alert('Sucesso', 'Lote excluído com sucesso!');
            setModalVisible(false);
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao excluir lote:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao excluir o lote.');
        }
    };

    const fetchStockById = async () => {
        setLoading(true);
        const url = `${process.env.EXPO_PUBLIC_API_URL}/lote/${initialStock.id}?empresa=${empresa?.id}`;
        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            'Content-Type': 'application/json',
        };

        try {
            await fetchDataGetStockById(url, { headers, method: 'GET' });
        } catch (error) {
            console.error('Erro ao buscar lote por ID:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao carregar os detalhes do lote.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchStockById();
        }, [empresa, dataLogin])
    );

    useEffect(() => {
        if (responseGetStockById?.data) {
            setStock(responseGetStockById.data.lote);
            setStockKeys(Object.keys(responseGetStockById.data.lote) as (keyof Lote)[]);
        }
    }, [responseGetStockById]);

    const renderDetail = (key: keyof Lote, value: any) => {
        if (key === 'produto') {
            return (
                <View style={styles.itemContainer}>
                    <Text style={styles.label}>Produto:</Text>
                    <Text style={styles.value}>{value?.descricao || 'N/A'}</Text>
                </View>
            );
        }

        return (
            <View style={styles.itemContainer}>
                <Text style={styles.label}>Campo: {key}</Text>
                <Text style={styles.value}>
                    {value !== null && value !== undefined ? String(value) : 'N/A'}
                </Text>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <ModalExclude
                visible={modalVisible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                nomeItem={stock?.produto.descricao}
            />
            <Text style={styles.title}>Detalhes do Lote</Text>

            {loading ? (
                <FlatList
                    data={Array(5).fill(null)}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={() => (
                        <View style={styles.skeletonContainer}>
                            <View style={styles.skeletonText} />
                            <View style={styles.skeletonLine} />
                        </View>
                    )}
                />
            ) : (
                stockKeys.map((key) => renderDetail(key, stock[key]))
            )}

            <Actions>
                <Button
                    title="Excluir"
                    icon="trash"
                    onPress={() => setModalVisible(true)}
                />
                <Button
                    title="Editar"
                    icon="pencil"
                    onPress={() => navigation.navigate('EditStock', { stock })}
                />
            </Actions>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    itemContainer: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#555',
    },
    skeletonContainer: {
        backgroundColor: '#e0e0e0',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    skeletonText: {
        width: '50%',
        height: 20,
        backgroundColor: '#c0c0c0',
        marginBottom: 8,
        borderRadius: 4,
    },
    skeletonLine: {
        width: '80%',
        height: 15,
        backgroundColor: '#d0d0d0',
        borderRadius: 4,
    },
});
