import { Actions } from '@/src/components/common/Actions';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input'; // Usando seu componente Input
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

export const EditCategories =  ({ route, navigation }: { route: any; navigation: any }) => {
    const { category } = route.params;
    const { empresa, dataLogin } = useAuth();
    const [_, fetchDataUpdateCategories] = useFetch();
    const [ dataDescricao, setDataDescricao ] = useState(category.descricao)

    const fetchCategories = async () => {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/categoria/${category.id}?empresa=${empresa?.id}`;
        const headers = { Authorization: `Bearer ${dataLogin?.token}` };
        const body = JSON.stringify({
            "descricao": dataDescricao
        })
        await fetchDataUpdateCategories(url, { headers, method: 'PUT', body });
    };
    const handleSave = () => {
        console.log(dataDescricao)
        fetchCategories();
        navigation.navigate('Categorias', { refresh: true }); 

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Item</Text>

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
