import { Actions } from '@/src/components/common/Actions';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input'; // Using your Input component
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

interface Supplier {
    id: string;
    descricao: string;
    telefone: string;
    cnpj: string;
}

export const EditSuppliers = ({ route, navigation }: { route: any; navigation: any }) => {
    const { item } = route.params;

    const [descricao, setDescricao] = useState(item.descricao);
    const [telefone, setTelefone] = useState(item.telefone);
    const [cnpj, setCnpj] = useState(item.cnpj);

    const handleSave = () => {
        if (!descricao || !telefone || !cnpj) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios!');
            return;
        }

        const updatedSupplier = {
            id: item.id,
            descricao,
            telefone,
            cnpj,
        };

        console.log('Fornecedor atualizado:', updatedSupplier);

        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Fornecedor</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Input
                    label="Descrição"
                    placeholder="Digite a descrição"
                    value={descricao}
                    onChangeText={setDescricao}
                />

                <Input
                    label="Telefone"
                    placeholder="Digite o telefone"
                    keyboardType="phone-pad"
                    value={telefone}
                    onChangeText={setTelefone}
                />

                <Input
                    label="CNPJ"
                    placeholder="Digite o CNPJ"
                    value={cnpj}
                    onChangeText={setCnpj}
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
        paddingVertical: 16,
        textAlign: 'center',
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});