import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { estilosGlobais } from "../styles/estilos";

type MenuUsuarioProps = {
    navigation: any;
};

export default function MenuUsuario({ navigation }: MenuUsuarioProps) {
    return (
        <View style={{ flex: 1, backgroundColor: "#cffeff", paddingHorizontal: 20 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 }}>
                <Text style={estilosGlobais.tituloTela}>USUÁRIO</Text>

                <TouchableOpacity style={[estilosGlobais.button, { marginVertical: 15 }]} onPress={() => navigation.navigate("AlterarDados")}>
                    <Text style={estilosGlobais.buttonText}>ALTERAR DADOS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[estilosGlobais.button, { marginVertical: 15 }]} onPress={() => navigation.navigate("ExcluirUsuario")}>
                    <Text style={estilosGlobais.buttonText}>EXCLUIR USUÁRIO</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[estilosGlobais.button, { marginVertical: 15 }]} onPress={() => navigation.navigate("Instrucoes")}>
                    <Text style={estilosGlobais.buttonText}>MANUAL DE INSTRUÇÕES</Text>
                </TouchableOpacity>

                <View style={{ marginTop: 30, width: "100%", alignItems: "center" }}>
                    <TouchableOpacity style={estilosGlobais.button} onPress={() => navigation.navigate("MenuPrincipal")}>
                        <Text style={estilosGlobais.buttonText}>VOLTAR AO MENU</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
