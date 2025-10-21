import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import estiloMedicamento from "../styles/estilomedicamento";
import api from "../api/api";
import * as Notifications from "expo-notifications";
import { agendarTodosMedicamentos } from "../ConfigAlarme";

export default function AdicionarMedicamento({ navigation }: any) {
  const [busca, setBusca] = useState("");
  const [nomeMedico, setNomeMedico] = useState("");
  const [doseValor, setDoseValor] = useState("");
  const [doseTipo, setDoseTipo] = useState("");
  const [durValor, setDurValor] = useState("");
  const [durTipo, setDurTipo] = useState("");
  const [continuo, setContinuo] = useState(false);
  const [timeInput, setTimeInput] = useState("");
  const [times, setTimes] = useState<string[]>([]);
  const [dias, setDias] = useState<Record<string, boolean>>({
    SEG: false, TER: false, QUA: false, QUI: false, SEX: false, SAB: false, DOM: false,
  });
  const [showDosePicker, setShowDosePicker] = useState(false);
  const [showDurPicker, setShowDurPicker] = useState(false);
  const doseOptions = ["GOTAS", "Ml(s)", "COMPRIMIDO(S)"];
  const durOptions = ["DIAS", "MESES"];

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const toggleDia = (d: string) => setDias((s) => ({ ...s, [d]: !s[d] }));
  const validarHora = (h: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(h);

  const formatarHora = (text: string) => {
    let v = text.replace(/\D/g, "").slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + ":" + v.slice(2);
    setTimeInput(v);
  };

  const addTime = () => {
    const t = timeInput.trim();
    if (!validarHora(t)) {
      Alert.alert("Horário inválido", "Use o formato HH:MM");
      return;
    }
    if (times.includes(t)) {
      Alert.alert("Já existe", "O horário já foi adicionado");
      return;
    }
    setTimes((s) => [...s, t]);
    setTimeInput("");
  };

  const removeTime = (t: string) => setTimes((s) => s.filter((x) => x !== t));

  const handleSalvar = async () => {
    if (!busca.trim()) return Alert.alert("Campo obrigatório", "Insira o nome do medicamento.");
    if (!doseValor.trim()) return Alert.alert("Campo obrigatório", "Insira a quantidade da dose.");
    if (!doseTipo.trim()) return Alert.alert("Campo obrigatório", "Selecione o tipo da dose.");
    if (!continuo) {
      if (!durValor.trim()) return Alert.alert("Campo obrigatório", "Insira o valor da duração.");
      if (!durTipo.trim()) return Alert.alert("Campo obrigatório", "Selecione o tempo de duração.");
    }
    if (times.length === 0) return Alert.alert("Campo obrigatório", "Adicione pelo menos um horário.");
    const algumDiaSelecionado = Object.values(dias).some((v) => v);
    if (!algumDiaSelecionado) return Alert.alert("Campo obrigatório", "Selecione pelo menos um dia.");

    const telefone = await AsyncStorage.getItem("usuarioTelefone");
    if (!telefone) {
      Alert.alert("Atenção", "Usuário não identificado. Faça cadastro novamente.");
      navigation.replace("Cadastro");
      return;
    }

    const payload = {
      nome: busca.trim(),
      nome_medico: nomeMedico || null,
      dose: doseValor.trim(),
      tipo: doseTipo.trim(),
      duracao: continuo ? "Contínuo" : `${durValor.trim()} ${durTipo}`,
      continuo: !!continuo,
      horarios: times,
      dias,
      usuarioTelefone: telefone,
    };

    try {
      await api.post("/medicamentos", payload);
      await agendarTodosMedicamentos(telefone);
      Alert.alert("Sucesso", `Medicamento ${busca} salvo e notificações agendadas.`);
      setBusca(""); setNomeMedico(""); setDoseValor(""); setDoseTipo(""); setDurValor(""); setDurTipo(""); setTimes([]);
      setDias({ SEG: false, TER: false, QUA: false, QUI: false, SEX: false, SAB: false, DOM: false });
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o medicamento.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding", android: undefined })}>
      <ScrollView contentContainerStyle={[estiloMedicamento.container, { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 }]}>
        <Text style={estiloMedicamento.tituloTela}>ADICIONAR MEDICAMENTO</Text>

        <View style={[estiloMedicamento.formContainer, { marginTop: 20 }]}>
          <TextInput
            placeholder="Insira o nome do medicamento"
            placeholderTextColor="#999"
            style={estiloMedicamento.input}
            value={busca}
            onChangeText={setBusca}
          />
          <TextInput
            style={estiloMedicamento.input}
            placeholder="Nome do médico"
            placeholderTextColor="#999"
            value={nomeMedico}
            onChangeText={setNomeMedico}
          />

          <View style={estiloMedicamento.smallRow}>
            <TextInput
              style={[estiloMedicamento.smallInput, { flex: 0, backgroundColor: "#fff" }]}
              placeholder="Dose"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={doseValor}
              onChangeText={(t) => setDoseValor(t.replace(/\D/g, "").slice(0, 4))}
              maxLength={4}
            />
            <TouchableOpacity
              style={[estiloMedicamento.selectBox, { flex: 1, marginTop: -15, marginLeft: 8 }]}
              onPress={() => setShowDosePicker(true)}
            >
              <Text style={estiloMedicamento.selectText}>
                {doseTipo || "Selecionar tipo"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={estiloMedicamento.smallRow}>
            <TextInput
              style={[estiloMedicamento.smallInput, { flex: 0, backgroundColor: continuo ? "#eee" : "#fff" }]}
              placeholder="Duração"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={durValor}
              onChangeText={(t) => setDurValor(t.replace(/\D/g, "").slice(0, 4))}
              editable={!continuo}
              maxLength={4}
            />
            <TouchableOpacity
              style={[estiloMedicamento.selectBox, { flex: 2, marginLeft: 8, marginTop: -15, backgroundColor: continuo ? "#eee" : "#fff" }]}
              onPress={() => !continuo && setShowDurPicker(true)}
              activeOpacity={continuo ? 1 : 0.7}
            >
              <Text style={estiloMedicamento.selectText}>
                {durTipo || "Selecionar (dias / meses)"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={estiloMedicamento.label}>HORÁRIO(S)</Text>
              <TextInput
                placeholder="HH:MM"
                placeholderTextColor="#999"
                style={[estiloMedicamento.timeInput, { marginLeft: 10 }]}
                value={timeInput}
                keyboardType="numeric"
                onChangeText={formatarHora}
                maxLength={5}
                onSubmitEditing={addTime}
                returnKeyType="done"
              />
            </View>

            <TouchableOpacity
              onPress={() => setContinuo((s) => !s)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                paddingVertical: 8,
                paddingHorizontal: 18,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: "#00bcd4",
                shadowColor: "#00000033",
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#0097A7", fontSize: 16 }}>CONTÍNUO</Text>
            </TouchableOpacity>
          </View>

          <View style={[estiloMedicamento.timesRow, { marginTop: 10 }]}>
            {times.map((t) => (
              <TouchableOpacity key={t} style={estiloMedicamento.timeBadge} onPress={() => removeTime(t)}>
                <Text style={estiloMedicamento.timeBadgeText}>{t}</Text>
                <Text style={{ color: "#c00", fontWeight: "800" }}>✕</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[estiloMedicamento.daysRow, { marginTop: 10 }]}>
            {["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"].map((d) => {
              const active = dias[d];
              return (
                <TouchableOpacity
                  key={d}
                  style={[estiloMedicamento.dayButton, active && estiloMedicamento.dayButtonActive]}
                  onPress={() => toggleDia(d)}
                >
                  <Text style={[estiloMedicamento.dayButtonText, active && estiloMedicamento.dayButtonTextActive]} adjustsFontSizeToFit numberOfLines={1}>
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ alignItems: "center", marginTop: 15 }}>
            <TouchableOpacity
              onPress={() => {
                const todosMarcados = Object.values(dias).every((v) => v);
                const novosDias = Object.keys(dias).reduce((acc, dia) => ({ ...acc, [dia]: !todosMarcados }), {});
                setDias(novosDias);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                paddingVertical: 8,
                paddingHorizontal: 18,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: "#00bcd4",
                shadowColor: "#00000033",
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#0097A7", fontSize: 16 }}>TODOS OS DIAS</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[estiloMedicamento.button, { marginTop: 20 }]} onPress={handleSalvar}>
          <Text style={estiloMedicamento.buttonText}>SALVAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[estiloMedicamento.button, { marginTop: 10 }]} onPress={() => navigation.goBack()}>
          <Text style={estiloMedicamento.buttonText}>VOLTAR</Text>
        </TouchableOpacity>

        <Modal visible={showDosePicker} transparent animationType="fade" onRequestClose={() => setShowDosePicker(false)}>
          <TouchableOpacity style={estiloMedicamento.modalOverlay} activeOpacity={1} onPress={() => setShowDosePicker(false)}>
            <View style={estiloMedicamento.modalContent}>
              {doseOptions.map((opt) => (
                <TouchableOpacity key={opt} style={estiloMedicamento.selectItem} onPress={() => { setDoseTipo(opt); setShowDosePicker(false); }}>
                  <Text style={estiloMedicamento.selectItemText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={showDurPicker} transparent animationType="fade" onRequestClose={() => setShowDurPicker(false)}>
          <TouchableOpacity style={estiloMedicamento.modalOverlay} activeOpacity={1} onPress={() => setShowDurPicker(false)}>
            <View style={estiloMedicamento.modalContent}>
              {durOptions.map((opt) => (
                <TouchableOpacity key={opt} style={estiloMedicamento.selectItem} onPress={() => { setDurTipo(opt); setShowDurPicker(false); }}>
                  <Text style={estiloMedicamento.selectItemText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
