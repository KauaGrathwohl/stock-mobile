import { Actions } from '@/src/components/common/Actions';
import { Button } from '@/src/components/common/Button';
import { ModalExclude } from '@/src/components/common/ModalExclude';
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface DataItem {
    id: string;
    key: string;
    value: string | number;
}

export const DetailsSuppliers = ({ route, navigation }: { route: any, navigation: any }) => {
    const { item } = route.params;
    const [modalVisible, setModalVisible] = useState(false);

    const handleCancel = () => {
        setModalVisible(false);
        console.log("Exclusão cancelada.");
    };

    const handleConfirm = () => {
        setModalVisible(false);
        console.log("Item excluído.");
    };

    return (
        <View style={styles.container}>
            <ModalExclude
                visible={modalVisible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                item={item}
            />
            <Text style={styles.title}>Detalhes do Fornecedor</Text>
            <FlatList
                data={item}
                keyExtractor={(dataItem: DataItem) => dataItem.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item: dataItem }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.label}>Campo: {dataItem.key}</Text>
                        <Text style={styles.label}>Valor: {dataItem.value}</Text>
                    </View>
                )}
            />
            <Actions>
                <Button title='Excluir' icon='trash' onPress={() => setModalVisible(true)} />
                <Button title='Editar' icon='pencil' onPress={() => navigation.navigate('EditSuppliers', { item: item })} />
            </Actions>
        </View>
    );
}

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
        marginBottom: 4,
    },
    listContent: {
        gap: 8,
    },
});