import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { useAuth } from "@/src/hooks/useAuth";
import { useFetch } from "@/src/hooks/useFetch";
import { Auth } from "@/src/interfaces/api";
import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const schema = z.object({
    email: z.string().email({ message: 'Email inválido' }),
    senha: z.string()
});

type LoginFormSchema = z.infer<typeof schema>;

export default function Login () {
    const auth = useAuth();
    const [authResponse, authFetchData] = useFetch();
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormSchema>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: LoginFormSchema) => {
        if (!data) {
            return alert('Preencha todos os campos');
        };

        const url = `${process.env.EXPO_PUBLIC_API_URL}/auth`;
        const body = JSON.stringify(data);
        const headers = { 'Content-Type': 'application/json' };
        await authFetchData(url, { body, headers, method: 'POST' });  
    };

    useEffect(() => {
        console.log('authResponse =>', authResponse)
        if (authResponse.data){
            auth?.login(authResponse?.data as Auth);        
            router.replace('/home');
        }
    }, [authResponse.data, auth, router.replace])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>StockSense</Text>
            <Text style={styles.text}>Bem-vindo!</Text>
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

            <Button
                title="Entrar"
                onPress={handleSubmit(onSubmit)}
            />
            <Button
                title="Criar nova conta"
                onPress={() => router.replace('/register' as any)}
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