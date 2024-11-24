import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { Actions } from '@/src/components/common/Actions';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

export const CreateStocks = ({ navigation }: { navigation: any }) => {
    const { empresa, dataLogin } = useAuth();
    const [responseCreateStock, fetchDataCreateStock] = useFetch();

    const [codigoBarras, setCodigoBarras] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [dataFabricacao, setDataFabricacao] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [produto, setProduto] = useState('');

    const handleSave = async () => {
        if (!codigoBarras || !quantidade || !dataFabricacao || !dataVencimento || !produto) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios!');
            return;
        }

        const url = `${process.env.EXPO_PUBLIC_API_URL}/lote?empresa=${empresa?.id}`;
        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            'Content-Type': 'application/json',
        };
        const body = JSON.stringify({
            codigoBarras,
            quantidade: parseInt(quantidade),
            dataFabricacao,
            dataVencimento,
            observacoes,
            produto: parseInt(produto),
        });

        try {
            await fetchDataCreateStock(url, { method: 'POST', headers, body });
            if (responseCreateStock?.error) {
                Alert.alert('Erro', 'Não foi possível criar o lote.');
                return;
            }
            Alert.alert('Sucesso', 'Lote criado com sucesso!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao criar o lote.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Criar Lote</Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Input label="Código de Barras" value={codigoBarras} onChangeText={setCodigoBarras} />
                <Input
                    label="Quantidade"
                    value={quantidade}
                    onChangeText={setQuantidade}
                    keyboardType="numeric"
                />
                <Input
                    label="Data de Fabricação"
                    value={dataFabricacao}
                    onChangeText={setDataFabricacao}
                    placeholder="YYYY-MM-DD"
                />
                <Input
                    label="Data de Vencimento"
                    value={dataVencimento}
                    onChangeText={setDataVencimento}
                    placeholder="YYYY-MM-DD"
                />
                <Input
                    label="Observações"
                    value={observacoes}
                    onChangeText={setObservacoes}
                />
                <Input
                    label="Produto ID"
                    value={produto}
                    onChangeText={setProduto}
                    keyboardType="numeric"
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
