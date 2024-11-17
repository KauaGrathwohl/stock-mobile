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

type SignInFormSchema = z.infer<typeof schema>;

export default function SignIn () {
    const auth = useAuth();
    const [authResponse, authFetchData] = useFetch();
    const { control, handleSubmit, formState: { errors } } = useForm<SignInFormSchema>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: SignInFormSchema) => {
        const body = JSON.stringify(data);
        const headers = { 'Content-Type': 'application/json' };
        await authFetchData('auth', { body, headers, method: 'POST' });  
        
        console.log(authResponse, 'authResponse.data', )
    };

    useEffect(() => {
        if (authResponse.data){
            auth?.login(authResponse?.data as Auth);        
            router.navigate('(auth)' as any);
        }
    }, [authResponse.data, auth, router.navigate])

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
                onPress={() => router.navigate('(public)/sign-up' as any)}
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