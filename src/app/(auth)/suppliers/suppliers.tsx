import { Button } from '@/src/components/common/Button';
import { CardCrud } from '@/src/components/common/CardCrud';
import { Search } from '@/src/components/common/Search';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

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

const formatCNPJ = (cnpj: string): string => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};

const formatPhoneNumber = (number: string): string => {
    const truncatedNumber = number.slice(0, 11);
    return truncatedNumber.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
};

export const Suppliers = ({ navigation }: { navigation: any; route: any }) => {
    const auth = useAuth();
    const [valueSearch, setValueSearch] = useState('');
    const [filteredData, setFilteredData] = useState<DataItem[][]>([]);
    const [items, setItems] = useState<DataItem[][]>([]);
    const [response, fetchData] = useFetch<{ fornecedores: Supplier[] }>();
    const [loading, setLoading] = useState<boolean>(true);

    const [inputsToCreate] = useState<InputField[]>([
        { id: '1', label: 'Nome', value: '', placeholder: 'Digite o nome do fornecedor', keyboardType: 'default' },
        { id: '2', label: 'Telefone', value: '', placeholder: 'Digite o telefone', keyboardType: 'phone-pad' },
        { id: '3', label: 'CNPJ', value: '', placeholder: 'Digite o CNPJ', keyboardType: 'default' },
    ]);

    const fetchSuppliers = async () => {
        setLoading(true);
        const url = `${process.env.EXPO_PUBLIC_API_URL}/fornecedor?empresa=${auth.user?.empresa.id ?? ''}&skip=0`;
        await fetchData(url, {
            headers: { Authorization: `Bearer ${auth.dataLogin?.token ?? ''}` },
        });
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchSuppliers();
        }, [auth.user?.empresa.id, auth.dataLogin?.token])
    );

    useEffect(() => {
        if (response.data && Array.isArray(response.data.fornecedores)) {
            const suppliers = response.data.fornecedores.map((supplier) => [
                { id: supplier.id, key: 'Nome', value: supplier.descricao },
                { id: supplier.id, key: 'Telefone', value: formatPhoneNumber(supplier.telefone) },
                { id: supplier.id, key: 'CNPJ', value: formatCNPJ(supplier.cnpj) },
            ]);
            setItems(suppliers);
            setFilteredData(suppliers);
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

    const renderSkeleton = () => (
        <View style={styles.skeletonCard}>
            <View style={styles.skeletonText} />
            <View style={styles.skeletonTextSmall} />
            <View style={styles.skeletonLine} />
        </View>
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

            {loading ? (
                <FlatList
                    data={Array(5).fill({})}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.contentContainer}
                    renderItem={renderSkeleton}
                />
            ) : (
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
            )}

            <Button
                title="Adicionar"
                icon="add"
                onPress={() =>
                    navigation.navigate('CreateSuppliers', {
                        item: {
                            title: 'Novo Fornecedor',
                            initialInputs: inputsToCreate,
                            onSave: handleSaveNewSupplier,
                            refreshSuppliers: fetchSuppliers,
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
    skeletonCard: {
        height: 100,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        padding: 16,
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    skeletonText: {
        width: '70%',
        height: 20,
        backgroundColor: '#c0c0c0',
        borderRadius: 4,
    },
    skeletonTextSmall: {
        width: '50%',
        height: 15,
        backgroundColor: '#c0c0c0',
        borderRadius: 4,
        marginTop: 8,
    },
    skeletonLine: {
        width: '90%',
        height: 15,
        backgroundColor: '#d0d0d0',
        borderRadius: 4,
        marginTop: 8,
    },
});