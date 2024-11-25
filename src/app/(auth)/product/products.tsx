import { Button } from '@/src/components/common/Button';
import { CardCrud } from '@/src/components/common/CardCrud';
import { Search } from '@/src/components/common/Search';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';

export interface ProductResponse {
    products: Product[];
}

export interface Product {
    id: number;
    descricao: string;
    custo: number;
    preco: number;
    quantidadeMinima: number;
    quantidadeMaxima: number;
    validade: string;
    createdAt: string;
    updatedAt: string;
    categoria: Categoria;
}

export interface Categoria {
    id: number;
    descricao: string;
    createdAt: string;
    updatedAt: string;
}

export const Products = ({ navigation }: { navigation: any }) => {
    const { empresa, dataLogin } = useAuth();
    const [responseGetProducts, fetchDataGetProducts] = useFetch<ProductResponse>();

    const [items, setItems] = useState<Product[]>([]);
    const [filteredData, setFilteredData] = useState<Product[]>([]);
    const [valueSearch, setValueSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    // Função para buscar produtos
    const fetchProducts = async () => {
        setLoading(true);
        const url = `${process.env.EXPO_PUBLIC_API_URL}/produto?empresa=${empresa?.id}`;
        const headers = { Authorization: `Bearer ${dataLogin?.token}` };
        await fetchDataGetProducts(url, { headers, method: 'GET' });
        setLoading(false);
    };

    // Atualiza os produtos ao abrir a tela
    useFocusEffect(
        useCallback(() => {
            fetchProducts();
        }, [empresa, dataLogin])
    );

    // Atualiza os produtos e os dados filtrados quando a resposta é recebida
    useEffect(() => {
        if (responseGetProducts?.data?.products) {
            const products = responseGetProducts.data.products;
            setItems(products);
            setFilteredData(products);
        }
    }, [responseGetProducts]);

    // Filtra os dados com base na pesquisa
    useEffect(() => {
        if (valueSearch.trim() === '') {
            setFilteredData(items);
        } else {
            const lowercasedValue = valueSearch.toLowerCase();
            const filtered = items.filter((item) =>
                item.descricao.toLowerCase().includes(lowercasedValue)
            );
            setFilteredData(filtered);
        }
    }, [valueSearch, items]);

    // Renderiza o esqueleto enquanto os dados são carregados
    const renderSkeleton = () => (
        <View style={styles.skeletonCard}>
            <View style={styles.skeletonText} />
            <View style={styles.skeletonTextSmall} />
            <View style={styles.skeletonLine} />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Campo de busca */}
            <View style={styles.searchContainer}>
                <Search
                    setValue={setValueSearch}
                    value={valueSearch}
                    placeholder="Pesquisar produtos"
                    label="Produtos"
                />
            </View>

            {/* Lista de produtos ou skeleton */}
            {loading ? (
                <FlatList
                    data={Array(5).fill({})}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.contentContainer}
                    renderItem={renderSkeleton}
                />
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.contentContainer}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('DetailsProducts', { product: item })
                            }
                        >
                            <CardCrud
                                topLeft={item.descricao}
                                bottomLeft={`Criado em: ${new Date(
                                    item.createdAt
                                ).toLocaleDateString()}`}
                                rightTop={`ID: ${item.id}`}
                                rightBottom={`Atualizado: ${new Date(
                                    item.updatedAt
                                ).toLocaleDateString()}`}
                            />
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Botão de adicionar produto */}
            <Button
                title="Adicionar"
                icon="add"
                onPress={() => navigation.navigate('CreateProducts')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flex: 1,
    },
    searchContainer: {
        marginBottom: 16,
        minHeight:120
    },
    contentContainer: {
        gap: 16,
    },
    skeletonCard: {
        height: 100,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        padding: 16,
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    skeletonText: {
        width: '70%',
        height: 20,
        backgroundColor: '#c0c0c0',
        borderRadius: 4,
    },
    skeletonTextSmall: {
        width: '50%',
        height: 15,
        backgroundColor: '#c0c0c0',
        borderRadius: 4,
        marginTop: 8,
    },
    skeletonLine: {
        width: '90%',
        height: 15,
        backgroundColor: '#d0d0d0',
        borderRadius: 4,
        marginTop: 8,
    },
});
