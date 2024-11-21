import { useAuth } from "@/src/hooks/useAuth";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ToastAndroid,
  Button,
} from "react-native";
import { EntradaSaida } from "@/src/interfaces/api";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "@/src/hooks/useFetch";
import Select from "../../common/Select/Select";
import { Input } from "../../common/Input";
import LoteSelect from "../Lote/LoteSelect";
import ProductSelect from "../Products/ProductSelect";
import SupplierSelect from "../Suppliers/SupplierSelect";

type Params = {
  isVisible: boolean;
  onFinish: (response?: EntradaSaida) => void;
};

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

export default function ModalMovimentacao({ isVisible, onFinish }: Params) {
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
      const response =
        movimentacaoResponse.data.Entrada || movimentacaoResponse.data.Saida;
      ToastAndroid?.show(movimentacaoResponse.data.message, ToastAndroid.SHORT);
      onFinish(response);
    }
  }, [movimentacaoResponse]);

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nova Movimentação</Text>

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

          <View style={styles.modalButtons}>
            <Button title="Cancelar" onPress={() => onFinish()} />
            <Button title="Adicionar" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
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
  },
});
