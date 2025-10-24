import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { estiloHistorico } from "../styles/estiloconsumo";

interface Consumo {
  id: number;
  nome: string;
  dose: string;
  horario: string;
  usuarioTelefone: string;
  status: "Consumido" | "Não consumido";
  data: string;
}

interface ConsumoFormatado extends Consumo {
  data: string;
  hora: string;
}

export default function HistoricoConsumo({ navigation }: any) {
  const [selecionado, setSelecionado] = useState<string>("");
  const [consumos, setConsumos] = useState<ConsumoFormatado[]>([]);
  const [loading, setLoading] = useState(false);
  const [telefone, setTelefone] = useState<string>("");
  const [nomesMedicamentos, setNomesMedicamentos] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem("usuarioTelefone");
      if (!t) return navigation.replace("Cadastro");
      setTelefone(t);
      await carregarHistorico(t);
    })();
  }, []);

  const carregarHistorico = async (t?: string) => {
    const tel = t || telefone;
    if (!tel) return;
    setLoading(true);
    try {
      const res = await api.get<Consumo[]>(`/consumo/${tel}`);
      const lista: ConsumoFormatado[] = res.data.map((c: Consumo) => ({
        ...c,
        data: new Date(c.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        hora: new Date(c.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      }));

      // Normaliza nomes: remove strings vazias e evita que dose seja interpretada como nome.
      const nomesExtraidos = lista
        .map((c) => (c.nome && typeof c.nome === "string" ? c.nome.trim() : ""))
        .filter((n) => n !== "" && n !== "(sem nome)");

      const nomesUnicos = Array.from(new Set(nomesExtraidos)).sort((a, b) => a.localeCompare(b, "pt-BR"));
      setNomesMedicamentos(nomesUnicos);

      setConsumos(lista);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao buscar histórico");
    } finally {
      setLoading(false);
    }
  };

  const consumosFiltrados = selecionado ? consumos.filter((c) => c.nome === selecionado) : [];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#cffeff" }} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text style={estiloHistorico.tituloTela}>HISTÓRICO DE CONSUMO</Text>
        <Text style={estiloHistorico.subtitulo}>SELECIONE O MEDICAMENTO PARA DETALHES DO CONSUMO</Text>

        <View style={estiloHistorico.pickerContainer}>
          <Picker
            selectedValue={selecionado}
            onValueChange={(v: string) => {
              setSelecionado(v);
            }}
          >
            <Picker.Item label="Selecione um Medicamento" value="" />
            {nomesMedicamentos.map((n, i) => (
              <Picker.Item key={i} label={n} value={n} />
            ))}
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0097A7" style={{ marginTop: 20 }} />
        ) : (
          <>
            {consumosFiltrados.length > 0 && (
              <View style={estiloHistorico.cabecalhoTabela}>
                <Text style={estiloHistorico.cabecalhoTexto}>DATA</Text>
                <Text style={estiloHistorico.cabecalhoTexto}>HORA</Text>
                <Text style={estiloHistorico.cabecalhoTexto}>DOSE</Text>
                <Text style={estiloHistorico.cabecalhoTexto}>CONSUMIDO</Text>
              </View>
            )}

            {consumosFiltrados.map((c, i) => (
              <View key={i} style={estiloHistorico.linhaTabela}>
                <Text style={estiloHistorico.textoTabela}>{c.data}</Text>
                <Text style={estiloHistorico.textoTabela}>{c.hora}</Text>
                <Text style={estiloHistorico.textoTabela}>{c.dose || "-"}</Text>
                <Text style={estiloHistorico.textoTabela}>{c.status === "Consumido" ? "☑️" : "❌"}</Text>
              </View>
            ))}

            {consumosFiltrados.length === 0 && !loading && (
              <Text style={{ textAlign: "center", marginTop: 20, color: "#333" }}>
                Nenhum registro encontrado.
              </Text>
            )}
          </>
        )}

        <View style={{ paddingVertical: 20 }}>
          <TouchableOpacity style={estiloHistorico.button} onPress={() => navigation.goBack()}>
            <Text style={estiloHistorico.buttonText}>VOLTAR AO MENU</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
