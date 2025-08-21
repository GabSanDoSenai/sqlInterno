import { Pressable, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export function Produto({ data, onDelete, onSelect, selecionado }) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.container,
        selecionado && styles.selecionado, // 🔹 aplica contorno se selecionado
      ]}
    >
      <Text style={styles.text}>
        {data.quantidade} - {data.nome}
      </Text>
      <TouchableOpacity onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CECECE",
    padding: 24,
    borderRadius: 5,
    gap: 12,
    flexDirection: "row",
    borderWidth: 0, // sem contorno padrão
  },
  selecionado: {
    borderColor: "#11A3D9",
    borderWidth: 2,
  },
  text: {
    flex: 1,
  },
});

