
import { useAuth } from '@/src/hooks/useAuth';
import { StyleSheet, Text, View } from 'react-native';

export default function Stock() {
    const auth = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Lotes</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    text: {
        fontSize: 16,
    }
});