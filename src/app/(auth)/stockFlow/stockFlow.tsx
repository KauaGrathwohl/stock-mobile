import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  EntradaResponse,
  EntradaSaida,
  SaidaResponse,
} from "@/src/interfaces/api";
import { useAuth } from "@/src/hooks/useAuth";
import { useFetch } from "@/src/hooks/useFetch";
import FlowFilter from "@/src/components/pages/StockFlow/FlowFilter";
import { Button } from "@/src/components/common/Button";
import { useFocusEffect } from "expo-router";

export default function StockFlow({ navigation }: { navigation: any }) {
  const auth = useAuth();
  const [tipoMovimentacao, setTipoMovimentacao] = useState<"entrada" | "saida">("entrada");
  const [movimentacoes, setMovimentacoes] = useState<EntradaSaida[]>([]);
  const [movimentacoesResponse, getMovimentacoes] = useFetch<EntradaResponse | SaidaResponse>();
  const [loading, setLoading] = useState(false);

  const searchMovimentacoes = async () => {
    setLoading(true);
    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/${tipoMovimentacao}?empresa=${auth.empresa?.id}`;
      await getMovimentacoes(url, { method: "GET" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const result =
      (movimentacoesResponse.data as EntradaResponse)?.entradas ||
      (movimentacoesResponse.data as SaidaResponse)?.saidas;

    setMovimentacoes(result);
  }, [movimentacoesResponse]);

  useEffect(() => {
    searchMovimentacoes();
  }, [tipoMovimentacao]);

  useFocusEffect(
    useCallback(() => {
      searchMovimentacoes();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Movimentações</Text>

      <FlowFilter
        selected={tipoMovimentacao}
        setSelected={setTipoMovimentacao}
      />

      {loading ? (
        <View style={{ height: "100%", marginTop: 10 }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={movimentacoes}
          keyExtractor={(item) => String(item.id)}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          renderItem={({ item }) => (
            <View style={styles.movementItem}>
              <View style={styles.textContainer}>
                <Text style={styles.itemText}>
                  Item: {item.produto.descricao}
                </Text>
                <Text style={styles.quantityText}>
                  Quantidade: {item.quantidade}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                {tipoMovimentacao === "entrada" ? (
                  <Feather name="trending-up" size={24} color="green" />
                ) : (
                  <Feather name="trending-down" size={24} color="red" />
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma movimentação registrada.
            </Text>
          }
        />
      )}

      <Button
        title="Adicionar"
        icon="add"
        onPress={() => navigation.navigate("CreateStockFlow")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding: 32,
  },
  movementItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
  },
  iconContainer: {
    marginLeft: 10,
  },
  quantityText: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  h1: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
