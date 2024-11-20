import { CardLoteVencimento } from '@/src/components/pages/Home/CardLoteVencimento';
import { useAuth } from '@/src/hooks/useAuth';
import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, Touchable, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Home() {
    const auth = useAuth();
    const arrLoteVencimento = [
        {
            "id": 3,
            "codigoBarras": "1266bc456dug",
            "dataFabricacao": "2024-01-10",
            "dataVencimento": "2024-05-10",
            "produto": {
                "id": 2,
                "descricao": "Coca-cola Zero 600ml"
            },
            "status": "expired"
        },
        {
            "id": 4,
            "codigoBarras": "1266bc34456dug",
            "dataFabricacao": "2024-01-10",
            "dataVencimento": "2024-05-10",
            "produto": {
                "id": 3,
                "descricao": "Coca-cola Zero 2l"
            },
            "status": "expired"
        },
        {
            "id": 5,
            "codigoBarras": "1266bc34456dug",
            "dataFabricacao": "2024-01-10",
            "dataVencimento": "2024-05-10",
            "produto": {
                "id": 3,
                "descricao": "Makita"
            },
            "status": "expiring"
        },
        {
            "id": 6,
            "codigoBarras": "1266bc34456dug",
            "dataFabricacao": "2024-01-10",
            "dataVencimento": "2024-05-10",
            "produto": {
                "id": 3,
                "descricao": "Guaraná 600ml"
            },
            "status": "valid"
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.greetings}>
                {auth.user?.nome ? (
                    <Text style={styles.h1}>
                        Olá, {auth.user?.nome}!
                    </Text>
                ) : ( <ActivityIndicator/> )}
            </View>
            {arrLoteVencimento.length ? (
                <View>
                    <View style={styles.cardVencimentoTitle}>
                        <Text style={styles.h2}>
                            Lotes a vencer
                        </Text>
                        <TouchableOpacity style={styles.refresh}>
                            <Feather name="refresh-cw" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    {arrLoteVencimento.map((loteVencimento) => (
                        <CardLoteVencimento
                            key={loteVencimento.id}
                            id={loteVencimento.id}
                            codigoBarras={loteVencimento.codigoBarras}
                            status={loteVencimento.status}
                            dataFabricacao={loteVencimento.dataFabricacao}
                            dataVencimento={loteVencimento.dataVencimento}
                            produto={loteVencimento.produto}
                        />
                    ))}
                </View>
            ) : ''}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 32,
        width: '100%',
    },
    greetings: {
        marginBottom: 32,
    },
    h1: {
        fontSize: 32,
        marginBottom: 16,
        fontWeight: 'bold',
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    cardVencimentoTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        width: '100%',
    },
    refresh: {
        marginTop: 8
    }
});