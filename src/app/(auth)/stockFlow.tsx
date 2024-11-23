import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { EntradaSaida } from "@/src/interfaces/api";
import ModalMovimentacao from "@/src/components/pages/StockFlow/ModalMovimentacao";

// todo precisa de rota no back que retorne todas entradas/saidas em uma lista
const mockEntradaSaida: EntradaSaida[] = [
  {
    id: 1,
    quantidade: 50,
    createdAt: "2024-11-01T10:30:00Z",
    updatedAt: "2024-11-15T14:45:00Z",
    lote: {
      id: 101,
      codigoBarras: "1234567890123",
      quantidade: 100,
      dataFabricacao: "2024-09-01",
      dataVencimento: "2025-09-01",
      observacoes: "Lote em perfeitas condições.",
      createdAt: "2024-09-01T08:00:00Z",
      updatedAt: "2024-11-15T12:00:00Z",
    },
    fornecedor: {
      id: 201,
      descricao: "Fornecedor A",
      email: "fornecedorA@example.com",
      telefone: "(11) 99999-8888",
      cnpj: "12.345.678/0001-99",
      logradouro: "Rua Principal, 123",
      cidade: 1,
      createdAt: "2024-01-15T09:00:00Z",
      updatedAt: "2024-11-01T10:30:00Z",
    },
    produto: {
      id: 301,
      descricao: "Produto A",
      custo: 10.5,
      preco: 15.75,
      quantidadeMinima: 20,
      quantidadeMaxima: 200,
      validade: "2025-09-01",
      createdAt: "2024-01-10T08:00:00Z",
      updatedAt: "2024-11-15T14:00:00Z",
      categoria: {
        id: 401,
        descricao: "Categoria 1",
        createdAt: "2023-12-01T12:00:00Z",
        updatedAt: "2024-10-15T12:00:00Z",
      },
    },
  },
  {
    id: 2,
    quantidade: 30,
    createdAt: "2024-11-05T12:00:00Z",
    updatedAt: "2024-11-18T16:00:00Z",
    lote: {
      id: 102,
      codigoBarras: "9876543210987",
      quantidade: 60,
      dataFabricacao: "2024-08-15",
      dataVencimento: "2025-08-15",
      observacoes: "Lote com algumas embalagens danificadas.",
      createdAt: "2024-08-15T07:30:00Z",
      updatedAt: "2024-11-17T14:00:00Z",
    },
    fornecedor: {
      id: 202,
      descricao: "Fornecedor B",
      email: "fornecedorB@example.com",
      telefone: "(21) 98888-7777",
      cnpj: "98.765.432/0001-55",
      logradouro: "Avenida Secundária, 456",
      cidade: 2,
      createdAt: "2023-11-20T10:15:00Z",
      updatedAt: "2024-11-05T12:00:00Z",
    },
    produto: {
      id: 302,
      descricao: "Produto B",
      custo: 20.0,
      preco: 30.0,
      quantidadeMinima: 10,
      quantidadeMaxima: 100,
      validade: "2025-08-15",
      createdAt: "2024-02-01T09:00:00Z",
      updatedAt: "2024-11-18T16:00:00Z",
      categoria: {
        id: 402,
        descricao: "Categoria 2",
        createdAt: "2023-11-01T11:00:00Z",
        updatedAt: "2024-09-20T15:00:00Z",
      },
    },
  },
  {
    id: 3,
    quantidade: 70,
    createdAt: "2024-11-10T14:00:00Z",
    updatedAt: "2024-11-19T18:30:00Z",
    lote: {
      id: 103,
      codigoBarras: "1112223334445",
      quantidade: 200,
      dataFabricacao: "2024-07-01",
      dataVencimento: "2025-07-01",
      observacoes: "Produto com alta rotatividade.",
      createdAt: "2024-07-01T08:00:00Z",
      updatedAt: "2024-11-19T18:00:00Z",
    },
    fornecedor: {
      id: 203,
      descricao: "Fornecedor C",
      email: "fornecedorC@example.com",
      telefone: "(31) 97777-6666",
      cnpj: "22.333.444/0001-66",
      logradouro: "Praça Central, 789",
      cidade: 3,
      createdAt: "2024-02-10T08:30:00Z",
      updatedAt: "2024-11-10T14:00:00Z",
    },
    produto: {
      id: 303,
      descricao: "Produto C",
      custo: 5.0,
      preco: 8.5,
      quantidadeMinima: 50,
      quantidadeMaxima: 500,
      validade: "2025-07-01",
      createdAt: "2024-03-01T07:00:00Z",
      updatedAt: "2024-11-19T18:30:00Z",
      categoria: {
        id: 403,
        descricao: "Categoria 3",
        createdAt: "2023-10-01T10:00:00Z",
        updatedAt: "2024-08-15T14:00:00Z",
      },
    },
  },
];

export default function StockFlow() {
  const [movimentacoes, setMovimentacoes] =
    useState<EntradaSaida[]>(mockEntradaSaida);
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <FlatList
        data={movimentacoes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.movementItem}>
            <Text style={styles.itemText}>Item: {item.produto.descricao}</Text>
            <Text style={styles.quantityText}>
              Quantidade: {item.quantidade}
            </Text>
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
