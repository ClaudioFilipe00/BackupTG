import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import notifee, { EventType } from "@notifee/react-native";
import { setNavigation } from "./src/ConfigAlarme";

import Cadastro from "./src/screens/Cadastro";
import MenuPrincipal from "./src/screens/MenuPrincipal";
import MenuUsuario from "./src/screens/MenuUsuario";
import MenuMedicamentos from "./src/screens/MenuMedicamentos";
import AdicionarMedicamentos from "./src/screens/AdicionarMedicamentos";
import AlterarMedicamentos from "./src/screens/AlterarMedicamentos";
import AlterarDados from "./src/screens/AlterarDados";
import ExcluirUsuario from "./src/screens/ExcluirUsuario";
import ExcluirMedicamentos from "./src/screens/ExcluirMedicamentos";
import ListaMedicamentos from "./src/screens/ListaMedicamentos";
import HistoricoConsumo from "./src/screens/HistoricoConsumo";
import ConfirmarConsumo from "./src/screens/ConfirmarConsumo";
import LoginTelefone from "./src/screens/LoginTelefone";
import Instrucoes from "./src/screens/Instrucoes"

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    AsyncStorage.getItem("usuarioTelefone").then((tel) => {
      setInitialRoute(tel ? "MenuPrincipal" : "Cadastro");
    });
  }, []);

  useEffect(() => {
    if (!initialRoute) return;
    if (navigationRef.current) setNavigation(navigationRef.current);

    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") alert("Permissão para notificações negada!");

      // Caso o app tenha sido aberto por uma notificação (app fechado)
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification?.notification?.data) {
        await AsyncStorage.setItem(
          "notificacaoPendente",
          JSON.stringify(initialNotification.notification.data)
        );
      }

      // Listener quando app está aberto
      notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS && detail.notification?.data) {
          const { nome, dose, horario } = detail.notification.data;
          if (navigationRef.current?.isReady()) {
            navigationRef.current.navigate("ConfirmarConsumo", { nome, dose, horario });
          }
        }
      });

      // Listener quando app está em segundo plano
      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS && detail.notification?.data) {
          await AsyncStorage.setItem(
            "notificacaoPendente",
            JSON.stringify(detail.notification.data)
          );
        }
      });
    })();
  }, [initialRoute]);

  // Assim que o NavigationContainer estiver pronto, verifica se há notificação pendente
  const onReady = async () => {
    const pendente = await AsyncStorage.getItem("notificacaoPendente");
    if (pendente) {
      const { nome, dose, horario } = JSON.parse(pendente);
      navigationRef.current?.navigate("ConfirmarConsumo", { nome, dose, horario });
      await AsyncStorage.removeItem("notificacaoPendente");
    }
  };

  if (!initialRoute) return null;

  return (
    <NavigationContainer ref={navigationRef} onReady={onReady}>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="MenuPrincipal" component={MenuPrincipal} />
        <Stack.Screen name="MenuMedicamentos" component={MenuMedicamentos} />
        <Stack.Screen name="AdicionarMedicamentos" component={AdicionarMedicamentos} />
        <Stack.Screen name="AlterarMedicamentos" component={AlterarMedicamentos} />
        <Stack.Screen name="AlterarDados" component={AlterarDados} />
        <Stack.Screen name="MenuUsuario" component={MenuUsuario} />
        <Stack.Screen name="ExcluirUsuario" component={ExcluirUsuario} />
        <Stack.Screen name="ExcluirMedicamentos" component={ExcluirMedicamentos} />
        <Stack.Screen name="ListaMedicamentos" component={ListaMedicamentos} />
        <Stack.Screen name="HistoricoConsumo" component={HistoricoConsumo} />
        <Stack.Screen name="ConfirmarConsumo" component={ConfirmarConsumo} />
        <Stack.Screen name="LoginTelefone" component={LoginTelefone} />
        <Stack.Screen name="Instrucoes" component={Instrucoes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
