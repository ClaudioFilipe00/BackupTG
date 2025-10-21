import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, BackHandler, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { estilosGlobais } from "../styles/estilos";
import { agendarTodosMedicamentos } from "../ConfigAlarme";

export default function MenuPrincipal({ navigation }: any) {
  const [primeiroNome, setPrimeiroNome] = useState<string>("Usuário");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const telefone = await AsyncStorage.getItem("usuarioTelefone");
        if (!telefone) {
          navigation.replace("Cadastro");
          return;
        }

        const res = await api.get(`/usuarios/${telefone}`);
        if (res.data?.nome) setPrimeiroNome(res.data.nome.split(" ")[0]);

        await agendarTodosMedicamentos(telefone);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, []);

  if (loading) {
    return (
      <View style={[estilosGlobais.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={estilosGlobais.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: 20,
        }}
      >
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 150, height: 250 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 30, fontWeight: "bold", color: "#0097A7" }}>
          Olá, {primeiroNome}
        </Text>
      </View>

      <Text style={estilosGlobais.tituloTela}>MENU</Text>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
        <TouchableOpacity
          style={[estilosGlobais.button, { marginVertical: 15 }]}
          onPress={() => navigation.navigate("MenuMedicamentos")}
        >
          <Text style={estilosGlobais.buttonText}>MEDICAMENTOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilosGlobais.button, { marginVertical: 15 }]}
          onPress={() => navigation.navigate("ListaMedicamentos")}
        >
          <Text style={estilosGlobais.buttonText}>LISTA DE MEDICAMENTOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilosGlobais.button, { marginVertical: 15 }]}
          onPress={() => navigation.navigate("HistoricoConsumo")}
        >
          <Text style={estilosGlobais.buttonText}>HISTÓRICO DE CONSUMO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilosGlobais.button, { marginVertical: 15 }]}
          onPress={() => navigation.navigate("MenuUsuario")}
        >
          <Text style={estilosGlobais.buttonText}>USUÁRIO</Text>
        </TouchableOpacity>

        <View style={{ marginBottom: 50, alignItems: "center", width: "60%" }}>
          <TouchableOpacity style={estilosGlobais.button} onPress={() => BackHandler.exitApp()}>
            <Text style={estilosGlobais.buttonText}>SAIR</Text> </TouchableOpacity>
        </View>
      </View>
    </View>

  );
}
