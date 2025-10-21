import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { estilosGlobais } from "../styles/estilos";

export default function AlterarDados({ navigation }: any) {
  const [usuario, setUsuario] = useState<any>(null);
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("usuarioTelefone").then(async tel => {
      if (!tel) return navigation.replace("Cadastro");
      setTelefone(tel);
      const res = await api.get(`/usuarios/${tel}`);
      setUsuario(res.data);
      setNome(res.data.nome);
      // Converter YYYY-MM-DD -> DD/MM/YYYY
      const [ano, mes, dia] = res.data.data_nascimento.split("-");
      setDataNascimento(`${dia}/${mes}/${ano}`);
    });
  }, []);

  const formatarDataParaBanco = (data: string) => {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`; // YYYY-MM-DD
  };

  const salvar = async () => {
    if (!usuario) return;
    try {
      const res = await api.put(`/usuarios/${usuario.id}`, {
        nome,
        data_nascimento: formatarDataParaBanco(dataNascimento)
      });
      Alert.alert("Sucesso", "Dados atualizados.");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Erro", err?.response?.data?.error || "Erro");
    }
  };

  const formatDataInput = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    if (cleaned.length > 5) cleaned = cleaned.slice(0, 5) + "/" + cleaned.slice(5, 9);
    setDataNascimento(cleaned);
  };

  return (

    <View style={estilosGlobais.container}>
      <Text style={estilosGlobais.tituloTela}>ALTERAR DADOS DO USUÁRIO</Text>
      <TextInput
        style={estilosGlobais.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={estilosGlobais.input}
        placeholder="DD/MM/AAAA"
        value={dataNascimento}
        onChangeText={formatDataInput}
        keyboardType="number-pad"
        maxLength={10}
      />
      <TextInput
        style={estilosGlobais.input}
        placeholder="Telefone"
        value={telefone}
        editable={false}
      />
      <TouchableOpacity style={estilosGlobais.button} onPress={salvar}>
        <Text style={estilosGlobais.buttonText}>SALVAR</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[estilosGlobais.button, { marginTop: 10 }]}
        onPress={() => navigation.navigate("MenuUsuario")}
      >
        <Text style={estilosGlobais.buttonText}>VOLTAR</Text>
      </TouchableOpacity>
    </View>

  );
}

