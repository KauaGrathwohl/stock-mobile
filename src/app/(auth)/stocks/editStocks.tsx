import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { Actions } from '@/src/components/common/Actions';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';

export const EditStocks = ({ route, navigation }: { route: any; navigation: any }) => {
    const { stock } = route.params;
    const { empresa, dataLogin } = useAuth();
    const [responseEditStock, fetchDataEditStock] = useFetch();

    const [codigoBarras, setCodigoBarras] = useState(stock.codigoBarras);
    const [quantidade, setQuantidade] = useState(stock.quantidade.toString());
    const [dataFabricacao, setDataFabricacao] = useState(stock.dataFabricacao);
    const [dataVencimento, setDataVencimento] = useState(stock.dataVencimento);
    const [observacoes, setObservacoes] = useState(stock.observacoes);

    const handleSave = async () => {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/lote/${stock.id}?empresa=${empresa?.id}`;
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
            produto: stock.produto.id, // Produto permanece inalterado
        });

        try {
            await fetchDataEditStock(url, { method: 'PUT', headers, body });
            if (responseEditStock?.error) {
                Alert.alert('Erro', 'Não foi possível atualizar o lote.');
                return;
            }
            Alert.alert('Sucesso', 'Lote atualizado com sucesso!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao atualizar o lote.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Lote</Text>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Input
                    label="Código de Barras"
                    value={codigoBarras}
                    onChangeText={setCodigoBarras}
                />
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
                <View style={styles.fixedField}>
                    <Text style={styles.label}>Produto</Text>
                    <Text style={styles.value}>{stock.produto.descricao}</Text>
                </View>
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
    fixedField: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#555',
    },
    value: {
        fontSize: 16,
        color: '#000',
    },
});
