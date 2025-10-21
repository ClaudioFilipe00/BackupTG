
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { estilosGlobais } from "../styles/estilos";


export default function ExcluirUsuario({ navigation }: any) {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem("usuarioTelefone").then(async tel => {
      if (!tel) return navigation.replace("Cadastro");
      const res = await api.get(`/usuarios/${tel}`);
      setUsuario(res.data);
    });
  }, []);

  const excluir = async () => {
    if (!usuario) return;
    Alert.alert("Confirmar", `Ao excluir o usuario "${usuario.nome}", todos os seus dados, incluindo medicamentos cadastrados serão deletados. Deseja continuar?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir", style: "destructive", onPress: async () => {
          try {
            await api.delete(`/usuarios/${usuario.id}`);
            await AsyncStorage.removeItem("usuarioTelefone");
            Alert.alert("Feito", "Usuário excluído.");
            navigation.reset({ index: 0, routes: [{ name: "Cadastro" }] });
          } catch (err: any) { Alert.alert("Erro", err?.response?.data?.error || "Erro"); }
        }
      }
    ]);
  };

  return (
    
      <View style={estilosGlobais.container}>
        <Text style={estilosGlobais.tituloTela}>Excluir Usuário</Text>
        <TouchableOpacity style={estilosGlobais.button} onPress={excluir}>
          <Text style={estilosGlobais.buttonText}>EXCLUIR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[estilosGlobais.button, { marginTop: 10 }]}
          onPress={() => navigation.navigate("MenuUsuario")}
        >
          <Text style={estilosGlobais.buttonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    
  );
}
