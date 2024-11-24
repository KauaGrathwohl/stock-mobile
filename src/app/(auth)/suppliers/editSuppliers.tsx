import { Actions } from '@/src/components/common/Actions';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch'; // Hook para centralizar requisições

interface Supplier {
    id: string;
    name: string;
    phone: string;
    cnpj: string;
}

export const EditSuppliers = ({ route, navigation }: { route: any; navigation: any }) => {
    const { item } = route.params;
    const { empresa, dataLogin } = useAuth();
    const [responseUpdateSupplier, fetchDataUpdateSupplier] = useFetch();

    const [name, setName] = useState(item.name);
    const [phone, setPhone] = useState(item.phone);
    const [cnpj, setCnpj] = useState(item.cnpj);

    const handleSave = async () => {
        if (!name || !phone || !cnpj) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios!');
            return;
        }

        const url = `${process.env.EXPO_PUBLIC_API_URL}/fornecedor/${item.id}?empresa=${empresa?.id}`;
        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            'Content-Type': 'application/json',
        };
        const body = JSON.stringify({
            descricao: name,
            email: "ambev@gmail.com",
            telefone: phone,
            cnpj: cnpj,
            logradouro: "endereço ambev",
            cidade: 0,
        });

        try {
            await fetchDataUpdateSupplier(url, { method: 'PUT', headers, body });

            if (responseUpdateSupplier?.error) {
                console.error('Erro ao atualizar fornecedor:', responseUpdateSupplier.error);
                Alert.alert('Erro', 'Não foi possível atualizar o fornecedor.');
                return;
            }

            Alert.alert('Sucesso', 'Fornecedor atualizado com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error('Erro na requisição:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao atualizar o fornecedor.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Fornecedor</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Input
                    label="Nome"
                    placeholder="Digite o nome"
                    value={name}
                    onChangeText={setName}
                />

                <Input
                    label="Telefone"
                    placeholder="Digite o telefone"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
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
