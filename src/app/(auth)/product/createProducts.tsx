import { Actions } from "@/src/components/common/Actions";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/Input";
import Select from "@/src/components/common/Select/Select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Alert, ScrollView, StyleSheet, Text, View, Platform, TouchableOpacity } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useFetch } from "@/src/hooks/useFetch";
import { useFocusEffect } from "@react-navigation/native";

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
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Estados para os inputs do formulário
    const [descricao, setDescricao] = useState("");
    const [custo, setCusto] = useState("");
    const [preco, setPreco] = useState("");
    const [quantidadeMinima, setQuantidadeMinima] = useState("");
    const [quantidadeMaxima, setQuantidadeMaxima] = useState("");
    const [validade, setValidade] = useState<string>(""); // Para exibição da data no formato de texto
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false); // Controle do seletor de datas

    // Detecta se o ambiente é web
    const isWeb = Platform.OS === "web";

    // Fetch das categorias
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

    // Função de salvar o produto
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
            Alert.alert("Erro", "Todos os campos são obrigatórios!");
            return;
        }

        const url = `${process.env.EXPO_PUBLIC_API_URL}/produto?empresa=${empresa?.id}`;
        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            "Content-Type": "application/json",
        };

        const body = {
            descricao,
            custo: parseFloat(custo),
            preco: parseFloat(preco),
            quantidadeMinima: parseInt(quantidadeMinima, 10),
            quantidadeMaxima: parseInt(quantidadeMaxima, 10),
            validade,
            categoria: selectedCategory.id,
            empresa: empresa?.id,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers,
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

    // Função para lidar com seleção de data
    const handleDateChange = (event: any, selectedDate?: Date) => {
        setIsDatePickerVisible(false);

        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split("T")[0];
            setValidade(formattedDate);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Criação de Produtos</Text>

            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                <Input
                    label="Descrição"
                    placeholder="Digite a descrição do produto"
                    value={descricao}
                    onChangeText={setDescricao}
                />
                <Input
                    label="Custo"
                    placeholder="Digite o custo do produto"
                    keyboardType="numeric"
                    value={custo}
                    onChangeText={setCusto}
                />
                <Input
                    label="Preço"
                    placeholder="Digite o preço do produto"
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

                {/* Campo de validade: seletor de data ou input de texto */}
                {isWeb ? (
                    <Input
                        label="Validade"
                        placeholder="Digite a data (YYYY-MM-DD)"
                        value={validade}
                        onChangeText={setValidade}
                    />
                ) : (
                    <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
                        <Input
                            label="Validade"
                            placeholder="Selecione uma data"
                            value={validade}
                            editable={false}
                        />
                    </TouchableOpacity>
                )}

                <Select
                    label="Categoria"
                    options={categories}
                    labelKey="descricao"
                    placeholder="Selecione uma categoria"
                    onChange={setSelectedCategory}
                />
            </ScrollView>

            <Actions>
                <Button title="Cancelar" onPress={() => navigation.goBack()} />
                <Button title="Salvar" onPress={handleSave} />
            </Actions>

            {/* Date Picker para dispositivos nativos */}
            {!isWeb && isDatePickerVisible && (
                <DateTimePicker
                    value={validade ? new Date(validade) : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
    },
    form: {
        gap: 16,
        paddingBottom: 32,
    },
});
