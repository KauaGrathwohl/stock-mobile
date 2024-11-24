import { Button } from '@/src/components/common/Button';
import { CardCrud } from '@/src/components/common/CardCrud';
import { Search } from '@/src/components/common/Search';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, FlatList, TouchableOpacity, Alert, Text } from 'react-native';

export interface CategoriesResponse {
    categories: Category[];
}

export interface Category {
    id: number;
    descricao: string;
    createdAt: string;
    updatedAt: string;
}

export const Categories = ({ navigation, route }: { navigation: any; route: any}) => {
    const { empresa, dataLogin } = useAuth();
    const [responseGetCategories, fetchDataGetCategories] = useFetch<CategoriesResponse>();

    const [items, setItems] = useState<Category[]>([]);
    const [filteredData, setFilteredData] = useState<Category[]>([]);
    const [valueSearch, setValueSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true); 

    const fetchCategories = async () => {
        setLoading(true); 
        console.log('Fetching categories...');
        const url = `${process.env.EXPO_PUBLIC_API_URL}/categoria?empresa=${empresa?.id}`;
        const headers = { Authorization: `Bearer ${dataLogin?.token}` };
        await fetchDataGetCategories(url, { headers, method: 'GET' });
        setLoading(false); 
    };

    useFocusEffect(
        useCallback(() => {
            if (route.params?.refresh) {
                fetchCategories(); // Recarrega as categorias
            }
            fetchCategories();
        }, [empresa, dataLogin])
    );

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

    useEffect(() => {  
        if (responseGetCategories?.data?.categories) {
            setItems(responseGetCategories?.data?.categories);
            setFilteredData(responseGetCategories?.data?.categories);
        } 
    })

    const renderSkeleton = () => (
        <View style={styles.skeletonCard}>
            <View style={styles.skeletonText} />
            <View style={styles.skeletonTextSmall} />
            <View style={styles.skeletonLine} />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search
                    setValue={setValueSearch}
                    value={valueSearch}
                    placeholder="Pesquisar"
                    key="pesquisa"
                    label="Categorias"
                />
            </View>

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
                                navigation.navigate('DetailsCategories', { category: item })
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

            <Button
                title="Adicionar"
                icon="add"
                onPress={() => navigation.navigate('CreateCategories')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 32,
        backgroundColor: '#fff',
        gap: 32,
        flex: 1,
    },
    searchContainer: {
        width: '100%',
        height: 100,
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
