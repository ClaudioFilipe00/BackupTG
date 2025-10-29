import React, { useState } from "react";
import {
  View, TextInput, TouchableOpacity, Text, Alert,
  ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { estilosGlobais } from "../styles/estilos";

export default function LoginTelefone({ navigation }: any) {
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [loading, setLoading] = useState(false);

  const formatarTelefone = (text: string) => {
    let cleaned = text.replace(/\D/g, "").slice(0, 11);

    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length > 7) formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;

    setTelefone(formatted);
  };

  const formatarData = (text: string) => {
    let cleaned = text.replace(/\D/g, "").slice(0, 8);
    if (cleaned.length > 4) cleaned = cleaned.replace(/^(\d{2})(\d{2})(\d{0,4})$/, "$1/$2/$3");
    else if (cleaned.length > 2) cleaned = cleaned.replace(/^(\d{2})(\d{0,2})$/, "$1/$2");
    setDataNascimento(cleaned);
  };

  const handleLogin = async () => {
    const telefoneNumeros = telefone.replace(/\D/g, "");
    if (!telefoneNumeros || telefoneNumeros.length !== 11)
      return Alert.alert("Atenção", "Digite um telefone válido.");

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento))
      return Alert.alert("Atenção", "Digite a data de nascimento no formato DD/MM/AAAA.");

    const [dia, mes, ano] = dataNascimento.split("/");
    const dataFormatada = `${ano}-${mes}-${dia}`;

    setLoading(true);
    try {
      const res = await api.post("/usuarios/login", {
        telefone: telefoneNumeros,
        data_nascimento: dataFormatada,
      });
      await AsyncStorage.setItem("usuarioTelefone", telefoneNumeros);
      navigation.reset({
        index: 0,
        routes: [{ name: "MenuPrincipal", params: { telefone: telefoneNumeros } }],
      });
    } catch (err: any) {
      const message = err?.response?.data?.error || "Erro ao fazer login.";
      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#cffeff" }}
      behavior={Platform.select({ ios: "padding" })}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Image
          source={require("../../assets/logo.png")}
          style={estilosGlobais.logo}
          resizeMode="contain"
        />

        <TextInput
          placeholder="Digite seu telefone"
          placeholderTextColor="#999"
          value={telefone}
          onChangeText={formatarTelefone}
          style={estilosGlobais.input}
          keyboardType="number-pad"
          maxLength={15}
        />

        <TextInput
          placeholder="Data de nascimento (DD/MM/AAAA)"
          placeholderTextColor="#999"
          value={dataNascimento}
          onChangeText={formatarData}
          style={estilosGlobais.input}
          keyboardType="number-pad"
          maxLength={10}
        />

        <TouchableOpacity
          style={[estilosGlobais.button, loading && { opacity: 0.6, marginTop: 10 }]}
          disabled={loading}
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={estilosGlobais.buttonText}>ENTRAR</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilosGlobais.button, { marginTop: 10 }]}
          onPress={() => navigation.navigate("Cadastro")}
        >
          <Text style={estilosGlobais.buttonText}>VOLTAR AO CADASTRO</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
