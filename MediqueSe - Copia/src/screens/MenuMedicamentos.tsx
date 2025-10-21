import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { estilosGlobais } from "../styles/estilos";

type MenuMedicamentosProps = {
    navigation: any;
};

export default function MenuMedicamentos({ navigation }: MenuMedicamentosProps) {
    return (
        <View style={{ flex: 1, backgroundColor: "#cffeff", paddingHorizontal: 20 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 }}>
                <Text style={estilosGlobais.tituloTela}>MEDICAMENTOS</Text>

                <TouchableOpacity style={[estilosGlobais.button, { marginVertical: 15 }]} onPress={() => navigation.navigate("AdicionarMedicamentos")}>
                    <Text style={estilosGlobais.buttonText}>ADICIONAR MEDICAMENTOS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[estilosGlobais.button, { marginVertical: 15 }]} onPress={() => navigation.navigate("AlterarMedicamentos")}>
                    <Text style={estilosGlobais.buttonText}>ALTERAR MEDICAMENTOS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[estilosGlobais.button, { marginVertical: 15 }]} onPress={() => navigation.navigate("ExcluirMedicamentos")}>
                    <Text style={estilosGlobais.buttonText}>EXCLUIR MEDICAMENTOS</Text>
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
