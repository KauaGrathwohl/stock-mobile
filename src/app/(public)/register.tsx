import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { useAuth } from "@/src/hooks/useAuth";
import { useFetch } from "@/src/hooks/useFetch";
import { Auth } from "@/src/interfaces/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";

const schema = z.object({
    nome: z.string(),
    email: z.string().email({ message: 'Email inválido' }),
    senha: z.string(),
    cpf: z.string()
});

type RegisterFormSchema = z.infer<typeof schema>;

export default function Register () {
    const auth = useAuth();
    const [authResponse, authFetchData] = useFetch();
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormSchema>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: RegisterFormSchema) => {
        const body = JSON.stringify(data);
        const headers = { 'Content-Type': 'application/json' };
        await authFetchData('usuarios', { body, headers, method: 'POST' });  
        
        console.log(authResponse, 'authResponse.data', )
    };

    useEffect(() => {
        if (authResponse.data){
            auth?.login(authResponse?.data as Auth);        
            router.replace('/home' as any);
        }
    }, [authResponse.data, auth, router.replace])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>StockSense</Text>
            <Text style={styles.text}>Crie sua conta!</Text>
            <Controller
                control={control}
                name="nome"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Nome"
                        placeholder="Digite seu nome"
                        keyboardType='default'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
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
            <Controller
                control={control}
                name="senha"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Senha"
                        placeholder="Digite sua senha"
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            <Controller
                control={control}
                name="cpf"
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="CPF"
                        placeholder="Digite seu CPF"
                        keyboardType="default"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            <Button
                title="Cadastrar"
                onPress={handleSubmit(onSubmit)}
            />
            <Button
                title="Já possuo uma conta"
                onPress={() => router.replace('/login' as any)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 32,
        gap: 16
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    }
});