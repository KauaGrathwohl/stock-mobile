import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type TipoMovimentacao = "entrada" | "saida";

type Params = {
  selected: TipoMovimentacao;
  setSelected: (tipo: TipoMovimentacao) => void;
};

export default function FlowFilter({ selected, setSelected }: Params) {
  return (
    <View style={styles.containerBtn}>
      <TouchableOpacity
        style={[
          styles.button,
          selected === "entrada"
            ? styles.selectedButton
            : styles.unselectedButton,
        ]}
        onPress={() => setSelected("entrada")}
      >
        <Text
          style={
            selected === "entrada" ? styles.selectedText : styles.unselectedText
          }
        >
          Entradas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          selected === "saida"
            ? styles.selectedButton
            : styles.unselectedButton,
        ]}
        onPress={() => setSelected("saida")}
      >
        <Text
          style={
            selected === "saida" ? styles.selectedText : styles.unselectedText
          }
        >
          Saídas
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  containerBtn: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "center",
    width: "90%",
    margin: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#fff",
  },
  unselectedButton: {
    backgroundColor: "#f0f0f0",
  },
  selectedText: {
    color: "#000",
    fontWeight: "bold",
  },
  unselectedText: {
    color: "#aaa",
  },
});
