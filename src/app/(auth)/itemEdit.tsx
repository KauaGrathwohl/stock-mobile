import { Actions } from '@/src/components/common/Actions';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input'; // Usando seu componente Input
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

interface Item {
    id: string;
    name: string;
    quantity: number;
    expirationDate: string;
}

export const ItemEdit = ({ route, navigation }: { route: any; navigation: any }) => {
    const { item } = route.params;

    const [name, setName] = useState(item.name);
    const [quantity, setQuantity] = useState(String(item.quantity));
    const [expirationDate, setExpirationDate] = useState(item.expirationDate);

    const handleSave = () => {
        if (!name || !quantity || !expirationDate) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios!');
            return;
        }

        const updatedItem = {
            id: item.id,
            name,
            quantity: parseInt(quantity, 10),
            expirationDate,
        };

        console.log('Item atualizado:', updatedItem);

        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Item</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Input
                    label="Nome"
                    placeholder="Digite o nome"
                    value={name}
                    onChangeText={setName}
                />

                <Input
                    label="Quantidade"
                    placeholder="Digite a quantidade"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                />

                <Input
                    label="Data de Validade"
                    placeholder="Digite a data de validade"
                    value={expirationDate}
                    onChangeText={setExpirationDate}
                />
            </ScrollView>

            <Actions>
                <Button title="Cancelar" onPress={() => navigation.goBack()} />
                <Button title="Salvar" onPress={handleSave} />
            </Actions>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 16,
        textAlign: 'center',
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});
