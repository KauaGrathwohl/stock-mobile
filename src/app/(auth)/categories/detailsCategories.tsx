import { Actions } from '@/src/components/common/Actions';
import { Button } from '@/src/components/common/Button';
import { ModalExclude } from '@/src/components/common/ModalExclude';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export interface Category {
    id: number;
    descricao: string;
    createdAt: string;
    updatedAt: string;
}

export const DetailsCategories = ({ route, navigation }: { route: any; navigation: any }) => {
    const { category } = route.params; 

    if (!category) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Nenhum dado disponível para esta categoria.</Text>
            </View>
        );
    }

    const categoryKeys = Object?.keys(category);

    const { empresa, dataLogin } = useAuth();
    const [_, fetchDataDeleteCategories] = useFetch();
    const [modalVisible, setModalVisible] = useState(false);

    const handleCancel = () => setModalVisible(false);
    const handleConfirm = () => {
        setModalVisible(false);
        fetchCategories();
        navigation.goBack()
    };

    const fetchCategories = async () => {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/categoria/${category.id}?empresa=${empresa?.id}`;
        const headers = { Authorization: `Bearer ${dataLogin?.token}` };
        await fetchDataDeleteCategories(url, { headers, method: 'DELETE' });
    };

    return (
        <View style={styles.container}>
            <ModalExclude
                visible={modalVisible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                nomeItem={category?.descricao}
            />
            <Text style={styles.title}>Detalhes do Item</Text>

            <FlatList
                data={categoryKeys}
                keyExtractor={(key) => key}
                contentContainerStyle={styles.listContent}
                renderItem={({ item: key }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.label}>Campo: {key}</Text>
                        <Text style={styles.value}>
                            Valor: {category?.[key] !== null && category?.[key] !== undefined ? String(category?.[key]) : 'N/A'}
                        </Text>
                    </View>
                )}
            />

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
});
