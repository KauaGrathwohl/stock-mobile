import { Actions } from '@/src/components/common/Actions';
import { Button } from '@/src/components/common/Button';
import { ModalExclude } from '@/src/components/common/ModalExclude';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';

export interface Category {
    id: number;
    descricao: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoriesResponse {
    category: Category;
}

export const DetailsCategories = ({ route, navigation }: { route: any; navigation: any }) => {
    const { category: initialCategory } = route.params;
    const { empresa, dataLogin } = useAuth();
    const [responseDeleteCategory, fetchDataDeleteCategories] = useFetch(); 
    const [responseGetCategoryById, fetchDataGetCategoryById] = useFetch<CategoriesResponse>();

    const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
    const [categoryKeys, setCategoryKeys] = useState<(keyof Category)[]>([]); 
    const [category, setCategory] = useState<Category>(initialCategory); 
    const [modalVisible, setModalVisible] = useState(false);

    const handleCancel = () => setModalVisible(false);

    const handleConfirm = async () => {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/categoria/${category.id}?empresa=${empresa?.id}`;
        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            'Content-Type': 'application/json',
        };

        try {
            await fetchDataDeleteCategories(url, { headers, method: 'DELETE' });
            if (responseDeleteCategory?.error) return Alert.alert('Erro', 'Não foi possível excluir a categoria.');
            Alert.alert('Sucesso', 'Categoria excluída com sucesso!');
            setModalVisible(false);
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao excluir a categoria.');
        }
    };

    const fetchCategoryById = async () => {
        setLoading(true); 
        const url = `${process.env.EXPO_PUBLIC_API_URL}/categoria/${initialCategory.id}?empresa=${empresa?.id}`;
        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            'Content-Type': 'application/json',
        };
        try {
            await fetchDataGetCategoryById(url, { headers, method: 'GET' });
        } catch (error) {
            console.error('Erro ao buscar categoria por ID:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao carregar os detalhes da categoria.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect( useCallback(() => { fetchCategoryById() }, [empresa, dataLogin]));
    
    useEffect(() =>{
        if (responseGetCategoryById?.data) {
            setCategory(responseGetCategoryById.data?.category);
            setCategoryKeys(Object.keys(responseGetCategoryById.data.category) as (keyof Category)[]);
        } 
    })

    const renderSkeleton = () => (
        <View style={styles.skeletonContainer}>
            <View style={styles.skeletonText} />
            <View style={styles.skeletonLine} />
        </View>
    );

    return (
        <View style={styles.container}>
            <ModalExclude
                visible={modalVisible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                nomeItem={category?.descricao}
            />
            <Text style={styles.title}>Detalhes da Categoria</Text>

            {loading ? (
                <FlatList
                    data={Array(5).fill(null)} // Skeleton com 5 itens
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderSkeleton}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <FlatList
                    data={categoryKeys}
                    keyExtractor={(key) => key}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item: key }) => (
                        <View style={styles.itemContainer}>
                            <Text style={styles.label}>Campo: {key}</Text>
                            <Text style={styles.value}>
                                Valor: {category[key] !== null && category[key] !== undefined ? String(category[key]) : 'N/A'}
                            </Text>
                        </View>
                    )}
                />
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
                    onPress={() => navigation.navigate('EditCategories', { category })}
                />
            </Actions>
        </View>
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
    listContent: {
        gap: 8,
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        textAlign: 'center',
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
