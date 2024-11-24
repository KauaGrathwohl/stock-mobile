import { Button } from '@/src/components/common/Button';
import { CardCrud } from '@/src/components/common/CardCrud';
import { Search } from '@/src/components/common/Search';
import { useAuth } from '@/src/hooks/useAuth';
import { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';

interface DataItem {
    id: string;
    key: string;
    value: string | number;
}

export default function Categories({ navigation }: { navigation: any }) {
    const auth = useAuth();
    const [valueSearch, setValueSearch] = useState('');
    const [filteredData, setFilteredData] = useState<DataItem[][]>([]);

    const item: DataItem[] = [
        { id: '1', key: 'nome do produto', value: 'Coca-cola' },
        { id: '2', key: 'quantidade', value: 10 },
        { id: '3', key: 'validade', value: '10/04/2024' },
        { id: '4', key: 'validade', value: '10/04/2024' },
        { id: '5', key: 'validade', value: '10/04/2024' },
        { id: '6', key: 'validade', value: '10/04/2024' },
        { id: '7', key: 'validade', value: '10/04/2024' },
        { id: '8', key: 'validade', value: '10/04/2024' },

    ];

    const items: DataItem[][] = Array(10).fill(item); // Cria uma lista de arrays de `DataItem`

    // Atualiza os dados filtrados ao alterar o valor de busca
    useEffect(() => {
        if (valueSearch === '') {
            setFilteredData(items); // Mostra todos os itens se o campo de pesquisa estiver vazio
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
    }, [valueSearch]);

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
                keyExtractor={(_, index) => index.toString()} // Identifica cada grupo de `DataItem`
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ItemDetails', { item })}
                    >
                        <CardCrud value={item} />
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.contentContainer}
            />

            <Button title="Adicionar" icon="add" />
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
        height:100
    },
    contentContainer: {
        gap: 16,
    },
});
