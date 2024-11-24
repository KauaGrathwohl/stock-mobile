import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Button } from '@/src/components/common/Button';
import { CardCrud } from '@/src/components/common/CardCrud';
import { Search } from '@/src/components/common/Search';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import { useFocusEffect } from '@react-navigation/native';

export interface Produto {
    id: number;
    descricao: string;
}

export interface Lote {
    id: number;
    codigoBarras: string;
    quantidade: number;
    dataFabricacao: string;
    dataVencimento: string;
    observacoes: string;
    produto: Produto;
}

export const Stocks = ({ navigation }: { navigation: any }) => {
    const { empresa, dataLogin } = useAuth();
    const [responseGetStocks, fetchDataGetStocks] = useFetch<{ lotes: Lote[] }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [stocks, setStocks] = useState<Lote[]>([]);
    const [filteredStocks, setFilteredStocks] = useState<Lote[]>([]);
    const [search, setSearch] = useState<string>('');

    const fetchStocks = async () => {
        setLoading(true);
        const url = `${process.env.EXPO_PUBLIC_API_URL}/lote?empresa=${empresa?.id}`;
        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            'Content-Type': 'application/json',
        };

        await fetchDataGetStocks(url, { method: 'GET', headers });

        if (responseGetStocks?.error) {
            console.error('Erro ao buscar lotes:', responseGetStocks.error);
            Alert.alert('Erro', 'Não foi possível carregar os lotes.');
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchStocks();
        }, [empresa, dataLogin])
    );

    useEffect(() => {
        if (responseGetStocks?.data?.lotes) {
            setStocks(responseGetStocks.data.lotes); // Atualiza os lotes
            setFilteredStocks(responseGetStocks.data.lotes); // Atualiza o filtro
        }
    }, [responseGetStocks]);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredStocks(stocks);
        } else {
            const lowercasedSearch = search.toLowerCase();
            const filtered = stocks.filter(
                (stock) =>
                    stock.codigoBarras.toLowerCase().includes(lowercasedSearch) ||
                    stock.observacoes.toLowerCase().includes(lowercasedSearch) ||
                    stock.produto.descricao.toLowerCase().includes(lowercasedSearch)
            );
            setFilteredStocks(filtered);
        }
    }, [search, stocks]);

    const handleDeleteStock = async (stockId: number) => {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/lote/${stockId}?empresa=${empresa?.id}`;
        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch(url, { method: 'DELETE', headers });
            if (response.ok) {
                Alert.alert('Sucesso', 'Lote excluído com sucesso!');
                fetchStocks();
            } else {
                Alert.alert('Erro', 'Não foi possível excluir o lote.');
            }
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao excluir o lote.');
        }
    };

    const renderStock = ({ item }: { item: Lote }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('DetailsStock', { stock: item })}
        >
            <CardCrud
                topLeft={`Produto: ${item.produto.descricao}`}
                bottomLeft={`Código de Barras: ${item.codigoBarras}`}
                rightTop={`Quantidade: ${item.quantidade}`}
                rightBottom={`Vencimento: ${new Date(item.dataVencimento).toLocaleDateString()}`}
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search
                    value={search}
                    setValue={setSearch}
                    placeholder="Pesquisar por produto, código de barras ou observação"
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <FlatList
                    data={filteredStocks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderStock}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Nenhum lote encontrado.</Text>
                    }
                />
            )}

            <Button
                title="Criar Lote"
                icon="add"
                onPress={() => navigation.navigate('CreateStock')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    searchContainer: {
        marginBottom: 16,
    },
    listContainer: {
        gap: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#777',
        fontSize: 16,
        marginTop: 32,
    },
});
