import { Actions } from "@/src/components/common/Actions";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/Input";
import Select from "@/src/components/common/Select/Select"; 
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useFetch } from "@/src/hooks/useFetch";
import { useFocusEffect } from "@react-navigation/native";

interface InputField {
    id: string;
    label: string;
    value: string | number;
    placeholder: string;
    keyboardType: string;
}

export interface CategoriesResponse {
    categories: Category[];
}

export interface Category {
    id: number;
    descricao: string;
    createdAt: string;
    updatedAt: string;
}

export const CreateProducts = ({ navigation }: { navigation: any }) => {
    const { empresa, dataLogin } = useAuth();
    const [responseGetCategories, fetchDataGetCategories] = useFetch<CategoriesResponse>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null); // Estado para categoria selecionada

    const [inputs, setInputs] = useState<InputField[]>([
        { id: "1", label: "Descrição", value: "", placeholder: "Digite o nome do produto", keyboardType: "default" },
        { id: "2", label: "Custo", value: "", placeholder: "Digite o custo", keyboardType: "numeric" },
        { id: "3", label: "Preço", value: "", placeholder: "Digite o preço", keyboardType: "numeric" },
        { id: "4", label: "Quantidade Mínima", value: "", placeholder: "Digite a quantidade mínima", keyboardType: "numeric" },
        { id: "5", label: "Quantidade Máxima", value: "", placeholder: "Digite a quantidade máxima", keyboardType: "numeric" },
        { id: "6", label: "Validade", value: "", placeholder: "Digite a validade (YYYY-MM-DD)", keyboardType: "default" },
    ]);

    const fetchCategories = async () => {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/categoria?empresa=${empresa?.id}`;
        const headers = { Authorization: `Bearer ${dataLogin?.token}` };
        await fetchDataGetCategories(url, { headers, method: "GET" });
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

    const handleInputChange = (id: string, text: string) => {
        setInputs((prevInputs) =>
            prevInputs.map((input) =>
                input.id === id ? { ...input, value: text } : input
            )
        );
    };

    const handleSave = async () => {
        if (inputs.some((input) => !input.value.toString().trim())) {
            Alert.alert("Erro", "Todos os campos são obrigatórios!");
            return;
        }
        if (!selectedCategory) {
            Alert.alert("Erro", "Por favor, selecione uma categoria!");
            return;
        }

        const url = `${process.env.EXPO_PUBLIC_API_URL}/produto?empresa=${empresa?.id}`;

        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            "Content-Type": "application/json",
        };

        const body ={
            descricao: inputs.find((input) => input.id === "1")?.value,
            custo: Number(inputs.find((input) => input.id === "2")?.value),
            preco: Number(inputs.find((input) => input.id === "3")?.value),
            quantidadeMinima: Number(inputs.find((input) => input.id === "4")?.value),
            quantidadeMaxima: Number(inputs.find((input) => input.id === "5")?.value),
            validade: inputs.find((input) => input.id === "6")?.value,
            categoria: selectedCategory.id,
            empresa: empresa?.id,
        };

        try {
            const response = await fetch(url, {
                headers,
                method: "POST",
                body: JSON.stringify(body),
            });

            if (response.ok) {
                Alert.alert("Sucesso", "Produto criado com sucesso!");
                navigation.goBack();
            } else {
                Alert.alert("Erro", "Falha ao criar o produto!");
            }
        } catch (error) {
            console.error("Erro ao criar produto:", error);
            Alert.alert("Erro", "Ocorreu um erro ao criar o produto.");
        }
    };

    const renderItem = ({ item }: { item: InputField }) => (
        <Input
            label={item.label}
            placeholder={item.placeholder}
            keyboardType={item.keyboardType as any}
            value={item.value.toString()}
            onChangeText={(text) => handleInputChange(item.id, text)}
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Criação de Produtos</Text>
            
            <FlatList
                data={inputs}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                style={styles.flatList}
                keyboardShouldPersistTaps="handled"
            />

            {/* Select de categoria */}
           

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
        flexGrow: 1,
    },
    container: {
        padding: 32,
        backgroundColor: '#fff',
        gap: 32,
        flex: 1,
    },
    actionsContainer: {
     
    },
});
