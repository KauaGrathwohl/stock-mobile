import { Actions } from "@/src/components/common/Actions";
import { Button } from "@/src/components/common/Button";
import { ModalExclude } from "@/src/components/common/ModalExclude";
import { useAuth } from "@/src/hooks/useAuth";
import { useFetch } from "@/src/hooks/useFetch";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";

export interface Product {
    id: number;
    descricao: string;
    custo: number;
    preco: number;
    quantidadeMinima: number;
    quantidadeMaxima: number;
    validade: string;
    createdAt: string;
    updatedAt: string;
    categoria: Categoria;
}

export interface Categoria {
    id: number;
    descricao: string;
    createdAt: string;
    updatedAt: string;
}

export const DetailsProducts = ({ route, navigation }: { route: any; navigation: any }) => {
    const { product:initialProduct } = route.params; // ID do produto passado por parâmetro
    const { empresa, dataLogin } = useAuth();
    const [responseGetProduct, fetchDataGetProduct] = useFetch<{ produto: Product }>();
    const [responseDeleteProduct, fetchDataDeleteProduct] = useFetch(); // Para excluir o produto

    const [loading, setLoading] = useState<boolean>(true);
    const [productKeys, setProductKeys] = useState<(keyof Product)[]>([]);
    const [product, setProduct] = useState<Product | null>(initialProduct);
    const [modalVisible, setModalVisible] = useState(false);

    const handleCancel = () => setModalVisible(false);

    const handleConfirm = async () => {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/produto/${product?.id}?empresa=${empresa?.id}`;
        const headers = {
            Authorization: `Bearer ${dataLogin?.token}`,
            "Content-Type": "application/json",
        };

        try {
            await fetchDataDeleteProduct(url, { headers, method: "DELETE" });

            if (responseDeleteProduct?.error) {
                Alert.alert("Erro", "Não foi possível excluir o produto.");
                return;
            }

            Alert.alert("Sucesso", "Produto excluído com sucesso!");
            setModalVisible(false);
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao excluir produto:", error);
            Alert.alert("Erro", "Ocorreu um erro ao excluir o produto.");
        }
    };

    const fetchProductById = async () => {
        const url = `${process.env.EXPO_PUBLIC_API_URL}/produto/${product?.id}?empresa=${empresa?.id}`;
        const headers = { Authorization: `Bearer ${dataLogin?.token}` };
        try {
            setLoading(true);
            await fetchDataGetProduct(url, { headers, method: "GET" });
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect( useCallback(() => { fetchProductById() }, [empresa, dataLogin]));

    useEffect(() =>{
        if (responseGetProduct?.data?.produto) {
            setProduct(responseGetProduct.data?.produto);
            setProductKeys(Object.keys(responseGetProduct.data.produto) as (keyof Product)[]);
        }
    }, [responseGetProduct])




    const renderSkeleton = () => (
        <View style={styles.skeletonContainer}>
            <View style={styles.skeletonText} />
            <View style={styles.skeletonLine} />
        </View>
    );

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    const renderValue = (key: keyof Product) => {
        if (!product) return "N/A";

        if (key === "categoria") {
            return product.categoria.descricao || "N/A";
        }

        if (key === "validade" || key === "createdAt" || key === "updatedAt") {
            return formatDate(product[key] as string);
        }

        const value = product[key];
        return typeof value === "object" ? JSON.stringify(value) : String(value) || "N/A";
    };

    return (
        <View style={styles.container}>
            <ModalExclude
                visible={modalVisible}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                nomeItem={product?.descricao || ""}
            />
            <Text style={styles.title}>Detalhes do Produto</Text>

            {loading ? (
                <FlatList
                    data={Array(5).fill(null)} // Skeleton com 5 itens
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderSkeleton}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <FlatList
                    data={productKeys}
                    keyExtractor={(key) => key}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item: key }) => (
                        <View style={styles.itemContainer}>
                            <Text style={styles.label}>Campo: {key}</Text>
                            <Text style={styles.value}>
                                Valor: {renderValue(key)}
                            </Text>
                        </View>
                    )}
                />
            )}

            <Actions>
                <Button
                    title="Excluir"
                    icon="trash"
                    onPress={() => setModalVisible(true)}
                />
                <Button
                    title="Editar"
                    icon="pencil"
                    onPress={() => navigation.navigate("EditProducts", { product })}
                />
            </Actions>
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
    itemContainer: {
        backgroundColor: "#f9f9f9",
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: "#555",
    },
    listContent: {
        gap: 8,
    },
    skeletonContainer: {
        backgroundColor: "#e0e0e0",
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    skeletonText: {
        width: "50%",
        height: 20,
        backgroundColor: "#c0c0c0",
        marginBottom: 8,
        borderRadius: 4,
    },
    skeletonLine: {
        width: "80%",
        height: 15,
        backgroundColor: "#d0d0d0",
        borderRadius: 4,
    },
});
