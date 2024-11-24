import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        width: "100%", // Ocupa 100% da largura
        flexDirection: "row", // Alinha os elementos lado a lado
        justifyContent: "space-between", // Espaço entre esquerda e direita
        alignItems: "center", // Alinha verticalmente
        paddingHorizontal: 32, // Espaçamento interno
        paddingVertical: 8,
        borderWidth: 1, // Borda para destacar o card
        borderRadius: 1000, // Arredondamento do card
        borderColor: "#ccc", // Cor da borda
        marginBottom: 16, // Espaço entre cards
    },
    leftSection: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontWeight: "bold", // Destaca o nome do produto
    },
    productQuantity: {
        fontSize: 12,
        color: "#666", // Cor secundária para quantidade
        marginTop: 4, // Espaço entre nome e quantidade
    },
    rightSection: {
        alignItems: "flex-end", // Alinha os textos à direita
    },
    validityLabel: {
        fontSize: 14,
        color: "#666",
    },
    validityDate: {
        fontSize: 12,
        fontWeight: "bold", // Destaca a data
        marginTop: 4,
    },
});
