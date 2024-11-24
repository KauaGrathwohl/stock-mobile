import { Actions } from "@/src/components/common/Actions";
import { Button } from "@/src/components/common/Button";
import { useAuth } from "@/src/hooks/useAuth";
import { useFetch } from "@/src/hooks/useFetch";
import { EntradaSaida } from "@/src/interfaces/api";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  ToastAndroid,
} from "react-native";

type EntradaSaidaResponse = {
  entrada?: EntradaSaida;
  saida?: EntradaSaida;
};

export default function DetailsStockFlow({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const auth = useAuth();
  const { movimentacao: movimentacaoParam, tipoMovimentacao } = route.params;

  const [loading, setLoading] = useState(false);
  const [movimentacaoResponse, fetchMovimentacao] = useFetch<EntradaSaidaResponse>();
  const [excluirResponse, excluirMovimentacao] = useFetch<{ message: string }>();
  const [movimentacao, setMovimentacao] = useState<EntradaSaida>();

  const loadMovimentacao = async () => {
    setLoading(true);
    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/${tipoMovimentacao}/${movimentacaoParam.id}?empresa=${auth.empresa?.id}`;
      await fetchMovimentacao(url, { method: "GET" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movimentacaoResponse.data?.entrada) setMovimentacao(movimentacaoResponse.data.entrada)
    if (movimentacaoResponse.data?.saida) setMovimentacao(movimentacaoResponse.data.saida)
  }, [movimentacaoResponse])

  const excluir = async () => {
    setLoading(true);
    try {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/${tipoMovimentacao}/${movimentacaoParam.id}?empresa=${auth.empresa?.id}`;
      await excluirMovimentacao(url, { method: "DELETE" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (excluirResponse.data?.message) {
      ToastAndroid?.show(excluirResponse.data.message, ToastAndroid.SHORT);
      navigation.goBack();
    }
  }, [excluirResponse])

  useEffect(() => {
    loadMovimentacao();
  }, [movimentacaoParam, tipoMovimentacao])

  const renderSkeleton = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonText} />
      <View style={styles.skeletonTextSmall} />
      <View style={styles.skeletonLine} />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Detalhes da Entrada</Text>

        {(loading || !movimentacao) ? (
          <FlatList
            data={Array(5).fill(null)}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderSkeleton}
          />
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Entrada</Text>
              <Text style={styles.text}>
                Quantidade: {movimentacao?.quantidade}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lote</Text>
              <Text style={styles.text}>
                Código de Barras: {movimentacao?.lote.codigoBarras}
              </Text>
              <Text style={styles.text}>
                Quantidade: {movimentacao?.lote.quantidade}
              </Text>
              <Text style={styles.text}>
                Data de Fabricação:{" "}
                {new Date(
                  movimentacao?.lote.dataFabricacao
                ).toLocaleDateString()}
              </Text>
              <Text style={styles.text}>
                Data de Vencimento:{" "}
                {new Date(
                  movimentacao?.lote.dataVencimento
                ).toLocaleDateString()}
              </Text>
              <Text style={styles.text}>
                Observações: {movimentacao.lote.observacoes}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Produto</Text>
              <Text style={styles.text}>
                Descrição: {movimentacao.produto.descricao}
              </Text>
              <Text style={styles.text}>
                Custo: R$ {movimentacao.produto.custo.toFixed(2)}
              </Text>
              <Text style={styles.text}>
                Preço: R$ {movimentacao.produto.preco.toFixed(2)}
              </Text>
              <Text style={styles.text}>
                Validade:{" "}
                {new Date(movimentacao.produto.validade).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fornecedor</Text>
              <Text style={styles.text}>
                Descrição: {movimentacao.fornecedor.descricao}
              </Text>
              <Text style={styles.text}>
                E-mail: {movimentacao.fornecedor.email}
              </Text>
              <Text style={styles.text}>
                Telefone: {movimentacao.fornecedor.telefone}
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <Actions>
        <></>
        <Button
          title="Excluir"
          icon="trash"
          onPress={excluir}
        />
      </Actions>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    gap: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
    overflowY: 'scroll'
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#333",
  },
  section: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#555",
  },
  text: {
    fontSize: 16,
    color: "#666",
    marginVertical: 2,
  },

  skeletonCard: {
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    padding: 16,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  skeletonText: {
    width: "70%",
    height: 20,
    backgroundColor: "#c0c0c0",
    borderRadius: 4,
  },
  skeletonTextSmall: {
    width: "50%",
    height: 15,
    backgroundColor: "#c0c0c0",
    borderRadius: 4,
    marginTop: 8,
  },
  skeletonLine: {
    width: "90%",
    height: 15,
    backgroundColor: "#d0d0d0",
    borderRadius: 4,
    marginTop: 8,
  },
});
