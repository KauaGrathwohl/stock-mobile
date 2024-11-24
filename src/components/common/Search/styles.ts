import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        gap: 16,
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row', // Alinha o ícone e o input lado a lado
        alignItems: 'center', // Centraliza o conteúdo verticalmente
        width: '100%',
        paddingHorizontal: 32,
        paddingVertical: 8,
        borderWidth: 1,
        borderRadius: 16,
    },
    icon: {
        marginRight: 16,
        fontSize: 20
    },
    input: {
        flex: 1, 
        fontSize: 16,
        paddingVertical: 8, 
        width: '100%'
    },
    Label: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
    },
});
