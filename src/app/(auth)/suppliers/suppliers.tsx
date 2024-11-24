import { Button } from '@/src/components/common/Button';
import { CardCrud } from '@/src/components/common/CardCrud';
import { Search } from '@/src/components/common/Search';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';

interface DataItem {
    id: string;
    key: string;
    value: string;
}

interface InputField {
    id: string;
    label: string;
    value: string;
    placeholder: string;
    keyboardType: string;
}

interface Supplier {
    id: string;
    descricao: string;
    telefone: string;
    cnpj: string;
}

export const Suppliers = ({ navigation }: { navigation: any; route: any }) => {
    const auth = useAuth();
    const [valueSearch, setValueSearch] = useState('');
    const [filteredData, setFilteredData] = useState<DataItem[][]>([]);
    const [items, setItems] = useState<DataItem[][]>([]);
    const [response, fetchData] = useFetch<{ fornecedores: Supplier[] }>();

    const [inputsToCreate] = useState<InputField[]>([
        { id: '1', label: 'Nome', value: '', placeholder: 'Digite o nome do fornecedor', keyboardType: 'default' },
        { id: '2', label: 'Telefone', value: '', placeholder: 'Digite o telefone', keyboardType: 'phone-pad' },
        { id: '3', label: 'CNPJ', value: '', placeholder: 'Digite o CNPJ', keyboardType: 'default' },
    ]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            const url = `${process.env.EXPO_PUBLIC_API_URL}/fornecedor?empresa=${auth.user?.empresa.id ?? ''}&skip=0`;
            await fetchData(url, {
                headers: { Authorization: `Bearer ${auth.dataLogin?.token ?? ''}` },
            });
        };
        fetchSuppliers();
    }, [auth.user?.empresa.id, auth.dataLogin?.token]);

    useEffect(() => {
        if (response.data && Array.isArray(response.data.fornecedores)) {
            const suppliers = response.data.fornecedores.map((supplier) => [
                { id: supplier.id, key: 'Nome', value: supplier.descricao },
                { id: supplier.id, key: 'Telefone', value: supplier.telefone },
                { id: supplier.id, key: 'CNPJ', value: supplier.cnpj },
            ]);
            setItems(suppliers);
            setFilteredData(suppliers);
        } else {
            console.error('Expected response.data.fornecedores to be an array');
        }
    }, [response.data]);

    useEffect(() => {
        if (valueSearch === '') {
            setFilteredData(items);
        } else {
            const lowercasedValue = valueSearch.toLowerCase();
            const filtered = items.filter((itemGroup) =>
                itemGroup.some(
                    (item) =>
                        item.key.toLowerCase().includes(lowercasedValue) ||
                        item.value.toString().toLowerCase().includes(lowercasedValue)
                )
            );
            setFilteredData(filtered);
        }
    }, [valueSearch, items]);

    const handleSaveNewSupplier = useCallback(
        (newInputs: InputField[]) => {
            console.log("Inputs recebidos do ItemCreate:", newInputs);
            const newSupplier = newInputs.map((input) => ({
                id: Math.random().toString(),
                key: input.label,
                value: input.value,
            }));

            const updatedItems = [...items, newSupplier];
            setItems(updatedItems);
            setFilteredData(updatedItems);
            Alert.alert('Sucesso', 'Fornecedor adicionado com sucesso!');
        },
        [items]
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search
                    setValue={setValueSearch}
                    value={valueSearch}
                    placeholder="Pesquisar"
                    key="pesquisa"
                    label="Fornecedores"
                />
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.contentContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('DetailsSuppliers', { item })}>
                        <CardCrud
                            topLeft={item?.[0]?.value}
                            bottomLeft={item?.[1]?.value}
                            rightTop={item?.[2]?.key}
                            rightBottom={item?.[2]?.value}
                        />
                    </TouchableOpacity>
                )}
            />

            <Button
                title="Adicionar"
                icon="add"
                onPress={() =>
                    navigation.navigate('CreateSuppliers', {
                        item: {
                            title: 'Novo Fornecedor',
                            initialInputs: inputsToCreate,
                            onSave: handleSaveNewSupplier,
                        },
                    })
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 32,
        backgroundColor: '#fff',
        gap: 32,
        flex: 1,
    },
    searchContainer: {
        width: '100%',
        height: 100,
    },
    contentContainer: {
        gap: 16,
    },
});