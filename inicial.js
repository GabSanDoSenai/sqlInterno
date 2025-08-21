import {
  View,
  Button,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import { usarBD } from "./hooks/usarBD";
import React, { useEffect, useState } from "react";
import { Produto } from "./components/produto";

export function Index() {
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [produtos, setProdutos] = useState([]);
  const produtosBD = usarBD();

  const [focusNome, setFocusNome] = useState(false);
  const [focusQuantidade, setFocusQuantidade] = useState(false);
  const [focusPesquisa, setFocusPesquisa] = useState(false);

  // 🔹 LISTAR deve estar definido antes de chamar
  async function listar() {
    try {
      const captura = await produtosBD.read(pesquisa);
      setProdutos(captura);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    listar();
  }, [pesquisa]);

  const remove = async (id) => {
    try {
      await produtosBD.remove(id);
      await listar();
    } catch (error) {
      console.log(error);
    }
  };

  const selecionar = (item) => {
  setId(String(item.id));
  setNome(item.nome);
  setQuantidade(String(item.quantidade));
  setItemSelecionado(Number(item.id));
  };

  async function salvar() {
    if (isNaN(quantidade)) {
      return Alert.alert("Quantidade", "A quantidade precisa ser um número!");
    }

    try {
      const item = await produtosBD.create({
        nome,
        quantidade: Number(quantidade),
      });

      Alert.alert("Produto cadastrado com o ID: " + item.idProduto);
      setId(item.idProduto);

      await listar(); // Atualiza a FlatList
      setNome("");
      setQuantidade("");
      setId("");
    } catch (error) {
      console.log(error);
    }
  }

  async function atualizarProduto() {
  if (!id) {
    return Alert.alert("Seleção", "Selecione um produto para atualizar!");
  }

  if (isNaN(quantidade)) {
    return Alert.alert("Quantidade", "A quantidade precisa ser um número!");
  }

  try {
    const idNum = Number(id);

    console.log("Atualizando produto:", { id: idNum, nome, quantidade: Number(quantidade) });

    // Atualiza no banco
    await produtosBD.update({
      id: idNum,
      nome,
      quantidade: Number(quantidade),
    });

    Alert.alert("Produto atualizado com sucesso!");

    // Atualiza a lista local sem precisar refazer toda a leitura
    setProdutos((prevProdutos) =>
      prevProdutos.map((p) =>
        p.id === idNum ? { ...p, nome, quantidade: Number(quantidade) } : p
      )
    );

    // Limpa campos e seleção
    setNome("");
    setQuantidade("");
    setId("");
    setItemSelecionado(null);
  } catch (error) {
    console.log("Erro ao atualizar:", error);
  }
}
  const [itemSelecionado, setItemSelecionado] = useState(null);

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.texto, focusNome && styles.focado]}
        placeholder="Nome"
        onChangeText={setNome}
        value={nome}
        onFocus={() => setFocusNome(true)}
        onBlur={() => setFocusNome(false)}
      />
      <TextInput
        style={[styles.texto, focusQuantidade && styles.focado]}
        placeholder="Quantidade"
        onChangeText={setQuantidade}
        value={quantidade}
        onFocus={() => setFocusQuantidade(true)}
        onBlur={() => setFocusQuantidade(false)}
      />
      <Button title="Salvar" onPress={salvar} />
      <Button title="Atualizar" onPress={atualizarProduto} />
      <TextInput
        style={[styles.texto, focusPesquisa && styles.focado]}
        placeholder="Pesquisar"
        onChangeText={setPesquisa}
        value={pesquisa}
        onFocus={() => setFocusPesquisa(true)}
        onBlur={() => setFocusPesquisa(false)}
      />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Produto
            data={item}
            onDelete={() => remove(item.id)}
            onSelect={() => selecionar(item)}
            selecionado={item.id === itemSelecionado} // 🔹 verdadeiro se estiver selecionado
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  texto: {
    height: 54,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#999",
    paddingHorizontal: 16,
  },
  focado: {
    borderColor: "#11A3D9",
    borderWidth: 2,
  },
  listContent: {
    gap: 16,
  },
});
