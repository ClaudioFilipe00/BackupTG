import React, { useEffect, useState } from "react";
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
import { Picker } from "@react-native-picker/picker";
import api from "../api/api";
import estiloMedicamento from "../styles/estilomedicamento";
import { configurarAlarme } from "../ConfigAlarme";

type AlterarMedicamentosProps = { navigation?: any };

export default function AlterarMedicamento({ navigation }: AlterarMedicamentosProps) {
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [busca, setBusca] = useState<string | null>(null);
  const [selectedMed, setSelectedMed] = useState<any | null>(null);
  const [nomeMedico, setNomeMedico] = useState("");
  const [doseValor, setDoseValor] = useState("");
  const [doseTipo, setDoseTipo] = useState("");
  const [durValor, setDurValor] = useState("");
  const [durTipo, setDurTipo] = useState("");
  const [continuo, setContinuo] = useState(false);
  const [timeInput, setTimeInput] = useState("");
  const [times, setTimes] = useState<string[]>([]);
  const [dias, setDias] = useState<Record<string, boolean>>({
    SEG: false,
    TER: false,
    QUA: false,
    QUI: false,
    SEX: false,
    SAB: false,
    DOM: false,
  });

  const [showDosePicker, setShowDosePicker] = useState(false);
  const [showDurPicker, setShowDurPicker] = useState(false);
  const doseOptions = ["GOTAS", "Ml(s)", "COMPRIMIDO(S)"];
  const durOptions = ["DIAS", "MESES"];

  useEffect(() => {
    const fetchMedicamentos = async () => {
      const telefone = await AsyncStorage.getItem("usuarioTelefone");
      if (!telefone) {
        navigation.replace("Cadastro");
        return;
      }
      try {
        const res = await api.get(`/medicamentos?telefone=${telefone}`);
        setMedicamentos(res.data || []);
      } catch {
        Alert.alert("Erro", "Falha ao carregar medicamentos");
      }
    };
    fetchMedicamentos();
  }, []);

  const safeParseArray = (v: any): any[] => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === "string") {
      try {
        const p = JSON.parse(v);
        return Array.isArray(p) ? p : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const safeParseObject = (v: any): Record<string, boolean> => {
    if (!v)
      return { SEG: false, TER: false, QUA: false, QUI: false, SEX: false, SAB: false, DOM: false };
    if (typeof v === "object" && !Array.isArray(v)) return v;
    if (typeof v === "string") {
      try {
        const p = JSON.parse(v);
        return typeof p === "object" && !Array.isArray(p) ? p : {};
      } catch {
        return {};
      }
    }
    return {};
  };

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

  const preencherCampos = (id: string | null) => {
    if (!id) {
      setBusca(null);
      setSelectedMed(null);
      setNomeMedico("");
      setDoseValor("");
      setDoseTipo("");
      setDurValor("");
      setDurTipo("");
      setContinuo(false);
      setTimes([]);
      setDias({ SEG: false, TER: false, QUA: false, QUI: false, SEX: false, SAB: false, DOM: false });
      return;
    }
    setBusca(id);
    const med = medicamentos.find((m) => m.id.toString() === id);
    if (!med) return;
    setSelectedMed(med);
    setNomeMedico(med.nome_medico ?? med.nomeMedico ?? "");
    setDoseValor(med.dose != null ? String(med.dose) : "");
    setDoseTipo(med.tipo ?? "");
    const medContinuo =
      !!med.continuo ||
      (typeof med.duracao === "string" && med.duracao.toLowerCase().includes("contínuo"));
    setContinuo(medContinuo);
    if (medContinuo) {
      setDurValor("");
      setDurTipo("");
    } else {
      const durStr: string = med.duracao ?? "";
      if (durStr) {
        const parts = durStr.split(" ");
        setDurValor(parts[0] ?? "");
        setDurTipo(parts.slice(1).join(" ") ?? "");
      } else {
        setDurValor("");
        setDurTipo("");
      }
    }
    setTimes(safeParseArray(med.horarios));
    const parsedDias = safeParseObject(med.dias);
    setDias({
      SEG: !!parsedDias.SEG,
      TER: !!parsedDias.TER,
      QUA: !!parsedDias.QUA,
      QUI: !!parsedDias.QUI,
      SEX: !!parsedDias.SEX,
      SAB: !!parsedDias.SAB,
      DOM: !!parsedDias.DOM,
    });
  };

  const objetosIguais = (a: any, b: any) => {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  };

  const handleSalvar = async () => {
    if (!busca) return Alert.alert("Atenção", "Selecione um medicamento para alterar.");
    if (!doseValor.trim() || !doseTipo.trim())
      return Alert.alert("Atenção", "Preencha dose e tipo obrigatórios.");

    const updates: any = {};
    const currentNomeMedico = selectedMed?.nome_medico ?? selectedMed?.nomeMedico ?? "";
    if (nomeMedico.trim() && nomeMedico.trim() !== currentNomeMedico)
      updates.nome_medico = nomeMedico.trim();
    const currentDose = selectedMed?.dose != null ? String(selectedMed.dose) : "";
    const currentTipo = selectedMed?.tipo ?? "";
    if (doseValor.trim() && doseValor.trim() !== currentDose) updates.dose = doseValor.trim();
    if (doseTipo.trim() && doseTipo.trim() !== currentTipo) updates.tipo = doseTipo.trim();
    const currentContinuo =
      !!selectedMed?.continuo ||
      (typeof selectedMed?.duracao === "string" && selectedMed.duracao?.toLowerCase().includes("contínuo"));
    if (continuo !== currentContinuo) {
      updates.continuo = !!continuo;
      updates.duracao = continuo ? "Contínuo" : durValor ? `${durValor} ${durTipo}` : null;
    } else if (!continuo) {
      const currentDuracao = selectedMed?.duracao ?? "";
      const newDuracao = durValor ? `${durValor} ${durTipo}` : "";
      if (newDuracao && newDuracao !== currentDuracao) updates.duracao = newDuracao;
    }
    const currentHorarios = safeParseArray(selectedMed?.horarios);
    if (!objetosIguais(currentHorarios, times)) updates.horarios = times;
    const currentDias = safeParseObject(selectedMed?.dias);
    const normalizedCurrentDias = {
      SEG: !!currentDias.SEG,
      TER: !!currentDias.TER,
      QUA: !!currentDias.QUA,
      QUI: !!currentDias.QUI,
      SEX: !!currentDias.SEX,
      SAB: !!currentDias.SAB,
      DOM: !!currentDias.DOM,
    };
    if (!objetosIguais(normalizedCurrentDias, dias)) updates.dias = dias;
    if (Object.keys(updates).length === 0)
      return Alert.alert("Nenhuma alteração", "Nenhuma mudança detectada.");

    try {
      await api.put(`/medicamentos/${busca}`, updates);
      const medAtualizado = { ...selectedMed, ...updates, id: selectedMed?.id ?? busca };
      await configurarAlarme(medAtualizado);
      Alert.alert("Concluído!", "Medicamento atualizado e notificações agendadas!");
    } catch {
      Alert.alert("Erro", "Falha ao atualizar o medicamento.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: "padding" })}>
      <ScrollView
        contentContainerStyle={[
          estiloMedicamento.container,
          { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 20 },
        ]}
      >
        <Text style={estiloMedicamento.tituloTela}>ALTERAR MEDICAMENTO</Text>
        <View style={[estiloMedicamento.formContainer, { marginTop: 20 }]}>
          <Picker
            selectedValue={busca}
            style={estiloMedicamento.picker}
            onValueChange={(itemValue) => preencherCampos(itemValue)}
          >
            <Picker.Item label="Selecione um medicamento" value={null} />
            {medicamentos.map((m) => (
              <Picker.Item key={m.id} label={m.nome} value={m.id.toString()} />
            ))}
          </Picker>

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
                {doseTipo ? doseTipo : "Selecionar tipo"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={estiloMedicamento.smallRow}>
            <TextInput
              style={[
                estiloMedicamento.smallInput,
                { flex: 0, backgroundColor: continuo ? "#eee" : "#fff" },
              ]}
              placeholder="Duração"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={durValor}
              onChangeText={(t) => setDurValor(t.replace(/\D/g, "").slice(0, 4))}
              editable={!continuo}
              maxLength={4}
            />
            <TouchableOpacity
              style={[
                estiloMedicamento.selectBox,
                { flex: 2, marginLeft: 8, marginTop: -15, backgroundColor: continuo ? "#eee" : "#fff" },
              ]}
              onPress={() => !continuo && setShowDurPicker(true)}
              activeOpacity={continuo ? 1 : 0.7}
            >
              <Text style={estiloMedicamento.selectText}>
                {durTipo ? durTipo : "Selecionar (dias / meses)"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center",  justifyContent: "space-between", marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={estiloMedicamento.label}>HORÁRIO(S)</Text>
              <TextInput
                placeholder="HH:MM"
                placeholderTextColor="#999"
                style={[estiloMedicamento.timeInput, { marginLeft: 10, width: 80 }]}
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
                marginLeft: 12,
                shadowColor: "#00000033",
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#0097A7", fontSize: 15 }}>CONTÍNUO</Text>
            </TouchableOpacity>
          </View>

          <View style={[estiloMedicamento.timesRow, { marginTop: 10 }]}>
            {times.map((t) => (
              <TouchableOpacity
                key={t}
                style={estiloMedicamento.timeBadge}
                onPress={() => removeTime(t)}
              >
                <Text style={estiloMedicamento.timeBadgeText}>{t}</Text>
                <Text style={{ color: "#c00", fontWeight: "800" }}>✕</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={estiloMedicamento.daysRow}>
            {["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"].map((d) => {
              const active = dias[d];
              return (
                <TouchableOpacity
                  key={d}
                  style={[estiloMedicamento.dayButton, active && estiloMedicamento.dayButtonActive]}
                  onPress={() => toggleDia(d)}
                >
                  <Text
                    style={[
                      estiloMedicamento.dayButtonText,
                      active && estiloMedicamento.dayButtonTextActive,
                    ]}
                  >
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
                const novosDias = Object.keys(dias).reduce(
                  (acc, dia) => ({ ...acc, [dia]: !todosMarcados }),
                  {}
                );
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
              <Text style={{ fontWeight: "bold", color: "#0097A7", fontSize: 15 }}>
                TODOS OS DIAS
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[estiloMedicamento.button, { marginTop: 20 }]} onPress={handleSalvar}>
          <Text style={estiloMedicamento.buttonText}>SALVAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estiloMedicamento.button, { marginTop: 10 }]}
          onPress={() => navigation.navigate("MenuMedicamentos")}
        >
          <Text style={estiloMedicamento.buttonText}>VOLTAR</Text>
        </TouchableOpacity>

        <Modal visible={showDosePicker} transparent animationType="fade">
          <TouchableOpacity
            style={estiloMedicamento.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDosePicker(false)}
          >
            <View style={estiloMedicamento.modalContent}>
              {doseOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={estiloMedicamento.selectItem}
                  onPress={() => {
                    setDoseTipo(opt);
                    setShowDosePicker(false);
                  }}
                >
                  <Text style={estiloMedicamento.selectItemText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal visible={showDurPicker} transparent animationType="fade">
          <TouchableOpacity
            style={estiloMedicamento.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDurPicker(false)}
          >
            <View style={estiloMedicamento.modalContent}>
              {durOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={estiloMedicamento.selectItem}
                  onPress={() => {
                    setDurTipo(opt);
                    setShowDurPicker(false);
                  }}
                >
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
