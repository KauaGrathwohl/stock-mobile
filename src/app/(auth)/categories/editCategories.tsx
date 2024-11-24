import { Actions } from '@/src/components/common/Actions';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input'; // Usando seu componente Input
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

export const EditCategories = ({ route, navigation }: { route: any; navigation: any }) => {
    const { category } = route.params; // Categoria recebida por parâmetro
    const { empresa, dataLogin } = useAuth(); // Dados de autenticação e empresa
    const [responseUpdateCategory, fetchDataUpdateCategories] = useFetch(); // Hook para requisição
    const [dataDescricao, setDataDescricao] = useState(category.descricao); // Estado do input

    const handleSave = async () => {
        if (!dataDescricao.trim()) {
            Alert.alert('Erro', 'O campo descrição é obrigatório!');
            return;
        }

        const url = `${process.env.EXPO_PUBLIC_API_URL}/categoria/${category.id}?empresa=${empresa?.id}`;
        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            'Content-Type': 'application/json',
        };
        const body = JSON.stringify({ descricao: dataDescricao });

        try {
            await fetchDataUpdateCategories(url, { headers, method: 'PUT', body });

            if (responseUpdateCategory?.error) {
                console.error('Erro ao atualizar categoria:', responseUpdateCategory.error);
                Alert.alert('Erro', 'Não foi possível atualizar a categoria.');
                return;
            }

            Alert.alert('Sucesso', 'Categoria atualizada com sucesso!');
            navigation.navigate('Categorias', { refresh: true }); // Navega para a lista com atualização
        } catch (error) {
            console.error('Erro ao realizar requisição:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao atualizar a categoria.');
        }
        finally{
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Categoria</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Input
                    label="Nome"
                    placeholder="Digite o nome"
                    value={dataDescricao}
                    onChangeText={setDataDescricao}
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
