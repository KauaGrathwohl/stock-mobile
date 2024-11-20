
import { Button } from '@/src/components/Button';
import { useAuth } from '@/src/hooks/useAuth';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Profile() {
    const auth = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meu Perfil</Text>
            <Button
                title="Sair"
                onPress={
                    () => {
                        auth.logout();
                        router.replace('/login');
                    }
                } 
            />
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