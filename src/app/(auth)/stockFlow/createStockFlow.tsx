import { useAuth } from "@/src/hooks/useAuth";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ToastAndroid } from "react-native";
import { EntradaSaida } from "@/src/interfaces/api";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "@/src/hooks/useFetch";
import Select from "@/src/components/common/Select/Select";
import ProductSelect from "@/src/components/pages/Products/ProductSelect";
import LoteSelect from "@/src/components/pages/Lote/LoteSelect";
import SupplierSelect from "@/src/components/pages/Suppliers/SupplierSelect";
import { Input } from "@/src/components/common/Input";
import { Actions } from "@/src/components/common/Actions";
import { Button } from "@/src/components/common/Button";

type EntradaSaidaResponse = {
  Entrada?: EntradaSaida;
  Saida?: EntradaSaida;
  message: string;
};

const schema = z.object({
  tipo: z.enum(["Entrada", "Saída"]),
  lote: z.number(),
  produto: z.number(),
  fornecedor: z.number(),
  quantidade: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive().min(1)
  ),
});
type FormSchema = z.infer<typeof schema>;

export default function CreateStockFlow({ navigation }: { navigation: any }) {
  const auth = useAuth();

  const [movimentacaoResponse, criarMovimentacao] =
    useFetch<EntradaSaidaResponse>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormSchema) => {
    const endpoint = data.tipo === "Entrada" ? "entrada" : "saida";
    const url = `${process.env.EXPO_PUBLIC_API_URL}/${endpoint}?empresa=${auth.empresa?.id}`;

    const body = JSON.stringify(data);
    const headers = { "Content-Type": "application/json" };
    await criarMovimentacao(url, { body, headers, method: "POST" });
  };

  useEffect(() => {
    if (movimentacaoResponse.data) {
      ToastAndroid?.show(movimentacaoResponse.data.message, ToastAndroid.SHORT);
      navigation.goBack();
    }
  }, [movimentacaoResponse]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criação de Movimentação</Text>

      <Controller
        control={control}
        name="tipo"
        render={({ field: { onChange, onBlur, value } }) => (
          <Select
            options={["Entrada", "Saída"]}
            onChange={onChange}
            labelKey=""
            allowSearch={false}
            placeholder="Tipo de movimentação"
            label="Tipo de movimentação"
          />
        )}
      />

      <Controller
        control={control}
        name="produto"
        render={({ field: { onChange, onBlur, value } }) => (
          <ProductSelect onChange={(produto) => onChange(produto?.id)} />
        )}
      />

      <Controller
        control={control}
        name="fornecedor"
        render={({ field: { onChange, onBlur, value } }) => (
          <SupplierSelect onChange={(selected) => onChange(selected?.id)} />
        )}
      />

      <Controller
        control={control}
        name="lote"
        render={({ field: { onChange, onBlur, value } }) => (
          <LoteSelect onChange={(selected) => onChange(selected?.id)} />
        )}
      />

      <Controller
        control={control}
        name="quantidade"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Quantidade"
            style={styles.input}
            keyboardType="numeric"
            value={value?.toString()}
            onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
            placeholder="Insira a quantidade"
          />
        )}
      />

      <View style={styles.actionsContainer}>
        <Actions>
          <Button title="Cancelar" onPress={() => navigation.goBack()} />
          <Button title="Adicionar" onPress={handleSubmit(onSubmit)} />
        </Actions>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 16,
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingBottom: 30,
  },
  actionsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopColor: "#ccc",
  },
});
