import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/api";
import estiloMedicamento from "../styles/estilomedicamento";

export default function ExcluirMedicamento({ navigation }: any) {
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>([]);

  useEffect(() => {
    carregarMedicamentos();
  }, []);

  const carregarMedicamentos = async () => {
    const telefone = await AsyncStorage.getItem("usuarioTelefone");
    if (!telefone) return navigation.replace("Cadastro");
    try {
      const res = await api.get(`/medicamentos?telefone=${telefone}`);
      setMedicamentos(res.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os medicamentos.");
    }
  };

  const alternarSelecao = (id: string) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleExcluir = async () => {
    if (selecionados.length === 0)
      return Alert.alert("Selecione ao menos um medicamento.");
    Alert.alert(
      "Confirmação",
      `Deseja realmente excluir ${selecionados.length} medicamento(s)?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              for (const id of selecionados) {
                await api.delete(`/medicamentos/${id}`);
              }
              Alert.alert("Sucesso", "Medicamentos excluídos com sucesso.");
              setSelecionados([]);
              carregarMedicamentos();
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Falha ao excluir os medicamentos.");
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={[
          estiloMedicamento.container,
          {
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 60,
          },
        ]}
      >
        <Text style={estiloMedicamento.tituloTela}>EXCLUIR MEDICAMENTO</Text>

        {medicamentos.map((m) => (
          <TouchableOpacity
            key={m.id}
            onPress={() => alternarSelecao(m.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#fff",
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderRadius: 10,
              marginVertical: 6,
              borderWidth: 2,
              borderColor: "#00bcd4",
            }}
          >
            <View
              style={{
                height: 28,
                width: 28,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: "#00bcd4",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
                backgroundColor: selecionados.includes(m.id) ? "#00bcd4" : "#fff",
              }}
            >
              {selecionados.includes(m.id) && (
                <Ionicons name="checkmark" size={20} color="#fff" />
              )}
            </View>

            <Text
              style={{
                flex: 1,
                color: "#0097A7",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {m.nome}
            </Text>
          </TouchableOpacity>
        ))}


        <TouchableOpacity style={estiloMedicamento.button} onPress={handleExcluir}>
          <Text style={estiloMedicamento.buttonText}>EXCLUIR SELECIONADOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estiloMedicamento.button, { marginTop: 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={estiloMedicamento.buttonText}>VOLTAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
