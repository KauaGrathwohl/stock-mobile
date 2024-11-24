import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Button } from '@/src/components/common/Button';
import { Actions } from '@/src/components/common/Actions';

export const DetailsStocks = ({ route, navigation }: { route: any; navigation: any }) => {
    const { stock } = route.params;

    const stockDetails = Object.entries(stock);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalhes do Lote</Text>
            <FlatList
                data={stockDetails}
                keyExtractor={([key]) => key}
                renderItem={({ item: [key, value] }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.label}>Campo: {key}</Text>
                        <Text style={styles.value}>Valor: {String(value)}</Text>
                    </View>
                )}
            />
            <Actions>
                <Button
                    title="Editar"
                    icon="pencil"
                    onPress={() => navigation.navigate('EditStock', { stock })}
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
        padding: 12,
        marginBottom: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    label: {
        fontWeight: 'bold',
    },
    value: {
        color: '#555',
    },
});
