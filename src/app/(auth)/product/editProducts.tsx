import { Actions } from '@/src/components/common/Actions';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import Select from '@/src/components/common/Select/Select'; // Select para categoria
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import { format } from 'date-fns'; // Para formatação da data
import { useFocusEffect } from 'expo-router';

export interface CategoriesResponse {
    categories: Category[];
}

export interface Category {
    id: number;
    descricao: string;
    createdAt: string;
    updatedAt: string;
}

export const EditProducts = ({ route, navigation }: { route: any; navigation: any }) => {
    const { product } = route.params; // Produto recebido por parâmetro
    const { empresa, dataLogin } = useAuth();
    const [responseUpdateProduct, fetchDataUpdateProduct] = useFetch();
    const [responseGetCategories, fetchDataGetCategories] = useFetch<CategoriesResponse>();
    const [categories, setCategories] = useState<Category[]>([]);
    
    // Estados do formulário
    const [descricao, setDescricao] = useState(product.descricao);
    const [custo, setCusto] = useState(String(product.custo));
    const [preco, setPreco] = useState(String(product.preco));
    const [quantidadeMinima, setQuantidadeMinima] = useState(String(product.quantidadeMinima));
    const [quantidadeMaxima, setQuantidadeMaxima] = useState(String(product.quantidadeMaxima));
    const [validade, setValidade] = useState(product.validade);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(product.categoria);

    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

    // Fetch de categorias
    const fetchCategories = async () => {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/categoria?empresa=${empresa?.id}`;
        const headers = { Authorization: `Bearer ${dataLogin?.token}` };
        await fetchDataGetCategories(url, { headers, method: 'GET' });
    };

    useFocusEffect(
        useCallback(() => {
            fetchCategories();
        }, [empresa, dataLogin])
    );

    useEffect(() => {
        if (responseGetCategories?.data?.categories) {
            setCategories(responseGetCategories?.data?.categories);
        }
    }, [responseGetCategories]);

    const handleSave = async () => {
        if (
            !descricao ||
            !custo ||
            !preco ||
            !quantidadeMinima ||
            !quantidadeMaxima ||
            !validade ||
            !selectedCategory
        ) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios!');
            return;
        }

        const url = `${process.env.EXPO_PUBLIC_API_URL}/produto/${product.id}?empresa=${empresa?.id}`;
        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            'Content-Type': 'application/json',
        };
        const body = JSON.stringify({
            descricao,
            custo: parseFloat(custo),
            preco: parseFloat(preco),
            quantidadeMinima: parseInt(quantidadeMinima, 10),
            quantidadeMaxima: parseInt(quantidadeMaxima, 10),
            validade,
            categoria: selectedCategory?.id,
        });

        try {
            await fetchDataUpdateProduct(url, { headers, method: 'PUT', body });

            if (responseUpdateProduct?.error) {
                console.error('Erro ao atualizar produto:', responseUpdateProduct.error);
                Alert.alert('Erro', 'Não foi possível atualizar o produto.');
                return;
            }

        } catch (error) {
            console.error('Erro ao realizar requisição:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao atualizar o produto.');
        }
        finally{
            Alert.alert('Sucesso', 'Produto atualizado com sucesso!');

            navigation.goBack();
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setIsDatePickerVisible(false);
        if (selectedDate) {
            const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
            const formattedDate = format(localDate, 'yyyy-MM-dd'); // Para salvar
            setValidade(formattedDate);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Produto</Text>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Input
                    label="Descrição"
                    placeholder="Digite a descrição do produto"
                    value={descricao}
                    onChangeText={setDescricao}
                />
                <Input
                    label="Custo"
                    placeholder="Digite o custo"
                    keyboardType="numeric"
                    value={custo}
                    onChangeText={setCusto}
                />
                <Input
                    label="Preço"
                    placeholder="Digite o preço"
                    keyboardType="numeric"
                    value={preco}
                    onChangeText={setPreco}
                />
                <Input
                    label="Quantidade Mínima"
                    placeholder="Digite a quantidade mínima"
                    keyboardType="numeric"
                    value={quantidadeMinima}
                    onChangeText={setQuantidadeMinima}
                />
                <Input
                    label="Quantidade Máxima"
                    placeholder="Digite a quantidade máxima"
                    keyboardType="numeric"
                    value={quantidadeMaxima}
                    onChangeText={setQuantidadeMaxima}
                />
                <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
                    <Input
                        label="Validade"
                        placeholder="Selecione a validade"
                        value={validade}
                        editable={false}
                    />
                </TouchableOpacity>
                <Select
                    label="Categoria"
                    options={categories} // Todas as categorias disponíveis
                    labelKey="descricao"
                    placeholder={selectedCategory?.descricao}
                    onChange={setSelectedCategory}
                
                />
            </ScrollView>

            <Actions>
                <Button title="Cancelar" onPress={() => navigation.goBack()} />
                <Button title="Salvar" onPress={handleSave} />
            </Actions>

            {isDatePickerVisible && (
                <DateTimePicker
                    value={validade ? new Date(validade) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    onChange={handleDateChange}
                />
            )}
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
        gap: 16,
    },
});
