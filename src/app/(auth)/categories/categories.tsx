import { Button } from '@/src/components/common/Button';
import { CardCrud } from '@/src/components/common/CardCrud';
import { Search } from '@/src/components/common/Search';
import { useAuth } from '@/src/hooks/useAuth';
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

export const Categories = ({ navigation, route }: { navigation: any; route: any }) => {
    const auth = useAuth();
    const [valueSearch, setValueSearch] = useState('');
    const [filteredData, setFilteredData] = useState<DataItem[][]>([]);
    const [items, setItems] = useState<DataItem[][]>([]); // Estado inicial para a lista principal

    const [inputsToCreate] = useState<InputField[]>([
        { id: '1', label: 'Nome', value: '', placeholder: 'Digite o nome da categoria', keyboardType: 'default' },
    ]);

    const initialItems: DataItem[] = [
        { id: '1', key: 'nome do produto', value: 'Coca-cola' },
        { id: '2', key: 'quantidade', value: '10' },
        { id: '3', key: 'validade', value: '10/04/2024' },
        { id: '4', key: 'validade', value: '10/04/2024' },
        { id: '5', key: 'validade', value: '10/04/2024' },
        { id: '6', key: 'validade', value: '10/04/2024' },
        { id: '7', key: 'validade', value: '10/04/2024' },
        { id: '8', key: 'validade', value: '10/04/2024' },
    ];

    // Preenchendo os dados iniciais
    useEffect(() => {
        const filledItems = Array(30).fill(initialItems);
        setItems(filledItems);
        setFilteredData(filledItems);
    }, []);

    // Atualizando dados filtrados com base na pesquisa
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

    const handleSaveNewCategory = useCallback(
        (newInputs: InputField[]) => {
            console.log("Inputs recebidos do ItemCreate:", newInputs);
            const newCategory = newInputs.map((input) => ({
                id: Math.random().toString(),
                key: input.label,
                value: input.value,
            }));
    
            const updatedItems = [...items, newCategory];
            setItems(updatedItems);
            setFilteredData(updatedItems);
            Alert.alert('Sucesso', 'Categoria adicionada com sucesso!');
        },
        [items] // Dependência: só será recriado quando `items` mudar
    );
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search
                    setValue={setValueSearch}
                    value={valueSearch}
                    placeholder="Pesquisar"
                    key="pesquisa"
                    label="Categorias"
                />
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.contentContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('DetailsCategories', { item })}>
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
                    navigation.navigate('CreateCategories', {
                        item: {
                            title: 'Nova Categoria',
                            initialInputs: inputsToCreate,
                            onSave: handleSaveNewCategory, // Callback para atualizar categorias
                        },
                    })
                }
            />
        </View>
    );
}

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
