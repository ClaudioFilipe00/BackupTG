import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, Image, ActivityIndicator, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { estilosGlobais } from "../styles/estilos";

export default function Cadastro({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefoneLimpo, setTelefoneLimpo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const tel = await AsyncStorage.getItem("usuarioTelefone");
      if (tel) {
        navigation.reset({ index: 0, routes: [{ name: "MenuPrincipal", params: { telefone: tel } }] });
      } else {
        try { await api.get("/ping"); } catch {}
      }
    };
    init();
  }, []);

  const formatData = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 2) cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    if (cleaned.length > 5) cleaned = cleaned.slice(0, 5) + "/" + cleaned.slice(5, 9);
    setDataNascimento(cleaned);
  };

  const formatTelefone = (text: string) => {
    let cleaned = text.replace(/\D/g, "").slice(0, 11);
    setTelefoneLimpo(cleaned);

    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length > 7) formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    setTelefone(formatted);
  };

  const validarDataAtual = (data: string) => {
    const [dia, mes, ano] = data.split("/").map(Number);
    const dataObj = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    return dataObj <= hoje && dataObj.getDate() === dia && dataObj.getMonth() === mes - 1 && dataObj.getFullYear() === ano;
  };

  const formatDataParaBanco = (data: string) => {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  const handleCadastro = async () => {
    if (loading) return;
    if (!nome || !dataNascimento || !telefoneLimpo) return Alert.alert("Atenção", "Preencha todos os campos!");
    if (/\d/.test(nome)) return Alert.alert("Atenção", "Nome não pode conter números.");
    if (nome.trim().split(" ").length < 2) return Alert.alert("Atenção", "Digite seu nome completo.");

    const regexData = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regexData.test(dataNascimento) || !validarDataAtual(dataNascimento))
      return Alert.alert("Atenção", "Data de nascimento inválida.");
    if (telefoneLimpo.length !== 11) return Alert.alert("Atenção", "Digite um telefone válido.");

    setLoading(true);
    try {
      const res = await api.post("/usuarios", { nome, telefone: telefoneLimpo, data_nascimento: formatDataParaBanco(dataNascimento) });
      await AsyncStorage.setItem("usuarioTelefone", telefoneLimpo);
      Alert.alert("Sucesso", `Bem-vindo, ${res.data.nome}!`);
      navigation.reset({ index: 0, routes: [{ name: "MenuPrincipal", params: { telefone: telefoneLimpo } }] });
    } catch (err: any) {
      const message = err?.response?.data?.error || "Erro ao cadastrar. Tente novamente em alguns segundos.";
      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={estilosGlobais.container}>
      <Image source={require("../../assets/logo.png")} style={estilosGlobais.logo} resizeMode="contain" />

      <TextInput
        placeholder="NOME COMPLETO"
        placeholderTextColor="#666666"
        allowFontScaling={false}
        value={nome}
        onChangeText={setNome}
        style={estilosGlobais.input}
      />
      <TextInput
        placeholder="DD/MM/AAAA"
        placeholderTextColor="#666666"
        allowFontScaling={false}
        value={dataNascimento}
        onChangeText={formatData}
        style={estilosGlobais.input}
        keyboardType="number-pad"
        maxLength={10}
      />
      <TextInput
        placeholder="NÚMERO DO TELEFONE"
        placeholderTextColor="#666666"
        allowFontScaling={false}
        value={telefone}
        onChangeText={formatTelefone}
        style={estilosGlobais.input}
        keyboardType="number-pad"
        maxLength={15}
      />

      <TouchableOpacity
        style={estilosGlobais.button}
        onPress={() => navigation.navigate("LoginTelefone")}
      >
        <Text style={estilosGlobais.buttonText}>JÁ TENHO CADASTRO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[estilosGlobais.button, loading && { opacity: 0.6 }]} disabled={loading} onPress={handleCadastro}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={estilosGlobais.buttonText}>CADASTRAR</Text>}
      </TouchableOpacity>
    </View>
  );
}
