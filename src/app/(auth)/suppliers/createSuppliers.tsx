import { Actions } from "@/src/components/common/Actions";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/Input";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useFetch } from "@/src/hooks/useFetch";

interface InputField {
    id: string;
    label: string;
    value: string;
    placeholder: string;
    keyboardType: string;
}

export const CreateSuppliers = ({ navigation, route }: { navigation: any; route: any }) => {
    const { empresa, dataLogin, user } = useAuth();
    const [responsePostSupplier, fetchDataPostSupplier] = useFetch();

    const [inputs, setInputs] = useState<InputField[]>([
        { id: "1", label: "Nome", value: "", placeholder: "Digite o nome do fornecedor", keyboardType: "default" },
        { id: "2", label: "Telefone", value: "", placeholder: "Digite o telefone", keyboardType: "phone-pad" },
        { id: "3", label: "CNPJ", value: "", placeholder: "Digite o CNPJ", keyboardType: "default" },
    ]);

    const handleInputChange = (id: string, text: string) => {
        setInputs((prevInputs) =>
            prevInputs.map((input) =>
                input.id === id ? { ...input, value: text } : input
            )
        );
    };

    const handleSave = () => {
        if (inputs.some((input) => !input.value.trim())) {
            Alert.alert("Erro", "Todos os campos são obrigatórios!");
            return;
        }
        console.log("Dados salvos:", inputs);
        const url = `${process.env.EXPO_PUBLIC_API_URL}/fornecedor?empresa=${empresa?.id}`;

        const body = JSON.stringify({
            'nome': inputs[0]?.value,
            'telefone': inputs[1]?.value,
            'cnpj': inputs[2]?.value
        });
        fetchDataPostSupplier(url, {
            body,
            headers: { Authorization: `Bearer ${dataLogin?.token}` },
            method: 'POST'
        });
        console.log(responsePostSupplier);
        Alert.alert("Sucesso", "Fornecedor criado com sucesso!");
        navigation.goBack();
    };

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
            <Text style={styles.title}>Criação de Fornecedores</Text>

            <FlatList
                data={inputs}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                style={styles.flatList}
                keyboardShouldPersistTaps="handled"
            />

            {/* Botões fixados na parte inferior */}
            <View style={styles.actionsContainer}>
                <Actions>
                    <Button title="Cancelar" onPress={() => navigation.goBack()} />
                    <Button title="Salvar" onPress={handleSave} />
                </Actions>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
        flexGrow: 1, // A FlatList ocupa o espaço disponível acima dos botões
    },
    actionsContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTopColor: "#ccc",
    },
});