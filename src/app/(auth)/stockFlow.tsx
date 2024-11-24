import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import {
  EntradaResponse,
  EntradaSaida,
  SaidaResponse,
} from "@/src/interfaces/api";
import ModalMovimentacao from "@/src/components/pages/StockFlow/ModalMovimentacao";
import { useAuth } from "@/src/hooks/useAuth";
import { useFetch } from "@/src/hooks/useFetch";
import FlowFilter from "@/src/components/pages/StockFlow/FlowFilter";

export default function StockFlow() {
  const auth = useAuth();
  const [tipoMovimentacao, setTipoMovimentacao] = useState<"entrada" | "saida">("entrada");
  const [isModalVisible, setModalVisible] = useState(false);
  const [movimentacoes, setMovimentacoes] = useState<EntradaSaida[]>([]);
  const [movimentacoesResponse, getMovimentacoes] = useFetch<EntradaResponse | SaidaResponse>();

  const searchMovimentacoes = async () => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/${tipoMovimentacao}?empresa=${auth.empresa?.id}`;
    await getMovimentacoes(url, { method: "GET" });
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

  return (
    <View style={styles.container}>
      
      <FlowFilter selected={tipoMovimentacao} setSelected={setTipoMovimentacao} />

      <FlatList
        data={movimentacoes}
        keyExtractor={(item) => String(item.id)}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        renderItem={({ item }) => (
          <View style={styles.movementItem}>
            <View style={styles.textContainer}>
              <Text style={styles.itemText}>Item: {item.produto.descricao}</Text>
              <Text style={styles.quantityText}>
                Quantidade: {item.quantidade}
              </Text>
            </View>
            <View style={styles.iconContainer}>
            {tipoMovimentacao === 'entrada' ? (
              <Feather name="trending-up" size={24} color="green" />
            ) : (
              <Feather name="trending-down" size={24} color="red" />
            )}
          </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma movimentação registrada.</Text>
        }
      />

      {isModalVisible && (
        <ModalMovimentacao
          isVisible={isModalVisible}
          onFinish={() => setModalVisible(!isModalVisible)}
        />
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  movementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
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
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007BFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});
