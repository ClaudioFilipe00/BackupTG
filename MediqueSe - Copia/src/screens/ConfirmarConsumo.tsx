import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notifee, { TimestampTrigger, TriggerType } from "@notifee/react-native";
import estiloConfirmarConsumo, { cores } from "../styles/estiloConfirmarConsumo";
import api from "../api/api";
import { Ionicons } from '@expo/vector-icons';

type ConfirmarConsumoProps = { route: any; navigation: any; };

export default function ConfirmarConsumo({ route, navigation }: ConfirmarConsumoProps) {
  const nome = route?.params?.nome ?? "REMÉDIO DESCONHECIDO";
  const dose = route?.params?.dose ?? "DOSE NÃO INFORMADA";
  const horario = route?.params?.horario ?? "HORÁRIO NÃO INFORMADO";
  const [usuarioTelefone, setUsuarioTelefone] = useState<string | null>(route?.params?.usuarioTelefone ?? null);
  const [loading, setLoading] = useState(false);
  const [tentativas, setTentativas] = useState(0);

  useEffect(() => {
    if (!usuarioTelefone) {
      AsyncStorage.getItem("usuarioTelefone").then(telefone => {
        if (telefone) setUsuarioTelefone(telefone);
      });
    }
    AsyncStorage.getItem(`tentativas_${nome}`).then(value => {
      if (value) setTentativas(parseInt(value, 10));
    });
  }, []);

  const registrarConsumo = async () => {
    if (!usuarioTelefone) return Alert.alert("Erro", "Telefone do usuário não informado.");
    setLoading(true);
    try {
      await api.post("/consumo", { nome, dose, horario, usuarioTelefone, status: "Consumido" });
      await AsyncStorage.removeItem(`tentativas_${nome}`);
      Alert.alert("Muito Bem!", "Medicamento Consumido!", [
        { text: "OK", onPress: () => navigation.navigate("MenuPrincipal") }
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao registrar consumo.");
    } finally { setLoading(false); }
  };

  const lembrarNovamente = async () => {
    if (!usuarioTelefone) return Alert.alert("Erro", "Telefone do usuário não informado.");

    if (tentativas < 2) {
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: Date.now() + 60 * 1000,
      };
      await notifee.createTriggerNotification({
        title: "Hora do medicamento",
        body: `Tome seu medicamento: ${nome} (${dose})`,
        android: { channelId: 'medicamentos', smallIcon: 'ic_launcher' },
        data: { nome, dose, horario, usuarioTelefone },
      }, trigger);

      const novasTentativas = tentativas + 1;
      setTentativas(novasTentativas);
      await AsyncStorage.setItem(`tentativas_${nome}`, novasTentativas.toString());
      navigation.navigate("MenuPrincipal");
    } else {
      setLoading(true);
      try {
        await api.post("/consumo", { nome, dose, horario, usuarioTelefone, status: "Não consumido" });
        await AsyncStorage.removeItem(`tentativas_${nome}`);
        Alert.alert("Aviso: Negou o Consumo Três Vezes", "Medicamento Não consumido.", [
          { text: "OK", onPress: () => navigation.navigate("MenuPrincipal") }
        ]);
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Falha ao atualizar status.");
      } finally { setLoading(false); }
    }
  };

  return (
    <KeyboardAvoidingView
      style={estiloConfirmarConsumo.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingTop: 60, paddingBottom: 40 }}>
        
        <Ionicons name="notifications-outline" size={80} color={cores.preto} style={{ marginBottom: 30 }} />

        <Text style={estiloConfirmarConsumo.nomeMedicamento}>{nome}</Text>
        <Text style={estiloConfirmarConsumo.dose}>DOSE: {dose}</Text>
        <Text style={estiloConfirmarConsumo.horario}>HORÁRIO: {horario}</Text>

        <TouchableOpacity style={estiloConfirmarConsumo.botao} onPress={registrarConsumo} disabled={loading}>
          {loading ? <ActivityIndicator color={cores.branco} /> : <Text style={estiloConfirmarConsumo.textoBotao}>CONSUMIDO</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[estiloConfirmarConsumo.botao, { marginTop: 10 }]} onPress={lembrarNovamente} disabled={loading}>
          <Text style={estiloConfirmarConsumo.textoBotao}>LEMBRAR NOVAMENTE</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
