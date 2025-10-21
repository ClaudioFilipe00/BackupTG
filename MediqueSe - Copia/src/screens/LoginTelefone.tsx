import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { estilosGlobais } from "../styles/estilos";

export default function LoginTelefone({ navigation }: any) {
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading] = useState(false);

  const pingServidor = async () => {
    try {
      await api.get("/ping");
      return true;
    } catch {
      return false;
    }
  };

  const handleLogin = async () => {
    const telefoneNumeros = telefone.replace(/\D/g, "");
    if (!telefoneNumeros || telefoneNumeros.length !== 11)
      return Alert.alert("Atenção", "Digite um telefone válido.");

    setLoading(true);
    const servidorOnline = await pingServidor();
    if (!servidorOnline) {
      setLoading(false);
      return Alert.alert("Erro", "Servidor temporariamente indisponível. Tente novamente em alguns segundos.");
    }

    try {
      const res = await api.get(`/usuarios/telefone/${telefoneNumeros}`);
      if (!res.data) return Alert.alert("Erro", "Usuário não encontrado.");
      await AsyncStorage.setItem("usuarioTelefone", telefoneNumeros);
      navigation.reset({ index: 0, routes: [{ name: "MenuPrincipal", params: { telefone: telefoneNumeros } }] });
    } catch (err: any) {
      const message = err?.response?.data?.error || "Erro ao buscar usuário. Tente novamente.";
      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  };

  const formatarTelefone = (text: string) => {
    let cleaned = text.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length > 10) {
      cleaned = cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (cleaned.length > 5) {
      cleaned = cleaned.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (cleaned.length > 2) {
      cleaned = cleaned.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
    } else if (cleaned.length > 0) {
      cleaned = cleaned.replace(/^(\d*)$/, "($1");
    }
    setTelefone(cleaned);
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
