import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        height: 48, // Define uma altura fixa
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#000',
        paddingHorizontal: 32,
        borderRadius: 16,
        
    },
    
    icon: {
        color: '#fff',
        fontSize: 20,
    },
    text: {
        color: '#fff',
        fontSize: 16,
    }
});