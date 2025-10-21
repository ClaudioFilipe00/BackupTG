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
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { estiloLista } from "../styles/estilolista";

export default function ListaMedicamentos({ navigation }: any) {
  const [meds, setMeds] = useState<any[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const telefone = await AsyncStorage.getItem("usuarioTelefone");
        if (!telefone) return navigation.replace("Cadastro");

        const res = await api.get(`/medicamentos?telefone=${telefone}`);
        setMeds(res.data);
      } catch (e) {
        console.log("Erro ao carregar medicamentos:", e);
        Alert.alert("Erro", "Falha ao carregar medicamentos. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading)
    return (
      <View style={[estiloLista.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#0097A7" />
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#cffeff" }}
      behavior={Platform.select({ ios: "padding" })}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <Text style={estiloLista.tituloTela}>LISTA DE MEDICAMENTOS</Text>

        {meds.map((m) => (
          <View key={m.id} style={estiloLista.card}>
            <View style={estiloLista.row}>
              <Text style={estiloLista.title}>{m.nome}</Text>
              <TouchableOpacity
                style={estiloLista.expandBtn}
                onPress={() => setOpenId(openId === m.id ? null : m.id)}
              >
                <Text style={estiloLista.expandBtnText}>{openId === m.id ? "−" : "+"}</Text>
              </TouchableOpacity>
            </View>

            {openId === m.id && (
              <View style={estiloLista.details}>
                <Text style={estiloLista.detailLabel}>Dose:</Text>
                <Text style={estiloLista.detailText}>{m.dose} {m.tipo}</Text>

                <Text style={[estiloLista.detailLabel, { marginTop: 10 }]}>Horários:</Text>
                <View style={estiloLista.timeRow}>
                  {(m.horarios || []).map((h: string, i: number) => (
                    <View key={i} style={estiloLista.timeBadge}>
                      <Text style={estiloLista.timeText}>{h}</Text>
                    </View>
                  ))}
                </View>

                <Text style={[estiloLista.detailLabel, { marginTop: 10 }]}>Duração:</Text>
                <Text style={estiloLista.detailText}>{m.continuo ? "Contínuo" : m.duracao}</Text>

                <Text style={[estiloLista.detailLabel, { marginTop: 10 }]}>Médico Solicitante:</Text>
                <Text style={estiloLista.detailText}>{m.nome_medico || "Não informado"}</Text>
              </View>
            )}
          </View>
        ))}

        <View style={{ paddingVertical: 20 }}>
          <TouchableOpacity style={estiloLista.button} onPress={() => navigation.goBack()}>
            <Text style={estiloLista.buttonText}>VOLTAR AO MENU</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
