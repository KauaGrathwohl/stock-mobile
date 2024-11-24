import { Actions } from "@/src/components/common/Actions";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/Input";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

interface InputField {
    id: string;
    label: string;
    value: string;
    placeholder: string;
    keyboardType: string;
}

export const CreateSuppliers = ({ navigation, route }: { navigation: any; route: any }) => {
    // Estado para gerenciar os inputs
    const [inputs, setInputs] = useState<InputField[]>([
        { id: "1", label: "Nome", value: "", placeholder: "Digite o nome", keyboardType: "default" },
        { id: "2", label: "Telefone", value: "", placeholder: "Digite o telefone", keyboardType: "phone-pad" },
        { id: "3", label: "CNPJ", value: "", placeholder: "Digite o CNPJ", keyboardType: "default" },
    ]);

    // Função para atualizar os valores dos inputs
    const handleInputChange = (id: string, text: string) => {
        setInputs((prevInputs) =>
            prevInputs.map((input) =>
                input.id === id ? { ...input, value: text } : input
            )
        );
    };

    // Função para salvar os dados
    const handleSave = () => {
        if (inputs.some((input) => !input.value.trim())) {
            Alert.alert("Erro", "Todos os campos são obrigatórios!");
            return;
        }

        console.log("Dados salvos:", inputs);
        Alert.alert("Sucesso", "Fornecedor criado com sucesso!");
        navigation.goBack();
    };

    // Renderização de cada item na FlatList
    const renderItem = ({ item }: { item: InputField }) => (
        <Input
            label={item.label}
            placeholder={item.placeholder}
            keyboardType={item.keyboardType as any}
            value={item.value}
            onChangeText={(text) => handleInputChange(item.id, text)}
        />
    );

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Criação de Fornecedores</Text>

                {/* FlatList para exibir os inputs */}
                <FlatList
                    data={inputs}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    style={styles.flatList}
                    keyboardShouldPersistTaps="handled"
                />
            </View>
            {/* Botões de ação fixados na parte inferior */}
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
        backgroundColor: "#fff",
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        paddingVertical: 16,
        textAlign: "center",
    },
    listContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    flatList: {
        flexGrow: 0,
        marginBottom: 16, // Espaço para evitar sobreposição com os botões
    },
});