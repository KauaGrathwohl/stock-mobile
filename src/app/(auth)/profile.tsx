
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { useAuth } from '@/src/hooks/useAuth';
import { useFetch } from '@/src/hooks/useFetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

const schema = z.object({
    nome: z.string(),
    email: z.string().email({ message: 'Email inválido' }),
    cpf: z.string().length(11, { message: 'CPF inválido' }),
});

type ProfileFormSchema = z.infer<typeof schema>;

export default function Profile() {
    const { empresa, user } = useAuth();
    const [response, fetchData] = useFetch();
    const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: user?.nome,
            email: user?.email,
            cpf: user?.cpf
        }
    });

    const onSubmit = async (data: ProfileFormSchema) => {
        if (!data) {
            return alert('Preencha todos os campos');
        };

        const url = `${process.env.EXPO_PUBLIC_API_URL}/usuario/${user?.id}?empresa=${empresa?.id}`;
        const body = JSON.stringify(data);
        const headers = { 'Content-Type': 'application/json' };
        await fetchData(url, { body, headers, method: 'PUT' });  
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meu Perfil</Text>
            <View style={styles.cardProfile}>
                <Text style={styles.h2}>{user?.nome}</Text>
                <Text style={styles.h3}>Cargo: {user?.cargo?.descricao}</Text>
                <Text style={styles.h3}>{empresa?.descricao}</Text>
                <Controller
                    control={control}
                    name="nome"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            label="Nome"
                            placeholder="Digite seu nome"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors && <Text>{errors.nome?.message}</Text>}
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            label="E-mail"
                            placeholder="Digite seu email"
                            keyboardType="email-address"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors && <Text>{errors.email?.message}</Text>}
                <Controller
                    control={control}
                    name="cpf"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            label="CPF"
                            placeholder="Digite seu CPF"
                            keyboardType="number-pad"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors && <Text>{errors.cpf?.message}</Text>}
                <View style={styles.buttonContainer}>
                    <Button
                        title="Salvar"
                        onPress={handleSubmit((data) => {
                            console.log(data);
                        })}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 32,
        width: '100%',
        height: '100%'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    h3: {
        fontSize: 16,
        textTransform: 'uppercase'
    },
    cardProfile: {
        backgroundColor: '#f5f5f5',
        padding: 16,
        borderRadius: 8,
        elevation: 2,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginBottom: 16,
    },
    buttonContainer: {
        width: '100%',
        margin: 16,
    }
});