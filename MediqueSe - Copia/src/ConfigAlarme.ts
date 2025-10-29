import notifee, { TimestampTrigger, TriggerType, AndroidImportance, EventType, Notification } from '@notifee/react-native';
import { Platform } from 'react-native';
import { NavigationContainerRef } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api/api';

const diasMap: Record<string, number> = { DOM: 0, SEG: 1, TER: 2, QUA: 3, QUI: 4, SEX: 5, SAB: 6 };
let navigationRef: NavigationContainerRef<any> | null = null;

export function setNavigation(ref: NavigationContainerRef<any>) {
  navigationRef = ref;
}

async function handleNotificationPress(notification: Notification) {
  const { nome = '', dose = '', horario = '', usuarioTelefone = '' } = notification.data ?? {};

  if (navigationRef?.isReady()) {
    navigationRef.navigate('ConfirmarConsumo', { nome, dose, horario, usuarioTelefone });
  } else {
    await AsyncStorage.setItem(
      'notificacaoPendente',
      JSON.stringify({ nome, dose, horario, usuarioTelefone })
    );
  }
}

notifee.onForegroundEvent(({ type, detail }) => {
  if (type === EventType.PRESS && detail.notification) handleNotificationPress(detail.notification);
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS && detail.notification) await handleNotificationPress(detail.notification);
});

export async function configurarAlarme(med: any) {
  if (Platform.OS !== 'android') return;

  let { nome, horarios, dias, dose, tipo, usuarioTelefone } = med;
  if (!horarios || !dias) return;
  if (typeof horarios === 'string') horarios = JSON.parse(horarios);
  if (typeof dias === 'string') dias = JSON.parse(dias);

  await notifee.createChannel({
    id: 'medicamentos',
    name: 'Medicamentos',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });

  const now = new Date();
  const uniqueIdBase = nome;
  const scheduled = await notifee.getTriggerNotifications();

  for (const notif of scheduled) {
    const notifId = (notif.notification as any).id;
    if (notifId?.startsWith(uniqueIdBase)) await notifee.cancelNotification(notifId);
  }

  for (const horarioStr of horarios) {
    const [hour, minute] = horarioStr.split(':').map(Number);

    for (const diaKey in dias) {
      if (!dias[diaKey]) continue;

      const targetDay = diasMap[diaKey];
      const triggerDate = new Date();
      triggerDate.setHours(hour, minute, 0, 0);
      let dayDiff = targetDay - triggerDate.getDay();
      if (dayDiff < 0 || (dayDiff === 0 && triggerDate <= now)) dayDiff += 7;
      triggerDate.setDate(triggerDate.getDate() + dayDiff);

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerDate.getTime(),
      };

      const notifId = `${uniqueIdBase}-${diaKey}-${hour}-${minute}`;
      try {
        await notifee.createTriggerNotification(
          {
            id: notifId,
            title: 'Hora do medicamento',
            body: `Tome seu medicamento: ${nome} (${dose} ${tipo})`,
            android: {
              channelId: 'medicamentos',
              smallIcon: 'ic_launcher',
              pressAction: { id: 'default' },
            },
            data: { nome, dose: `${dose} ${tipo}`, horario: horarioStr, usuarioTelefone },
          },
          trigger
        );
      } catch (err) {
        console.error('Erro ao agendar notificação:', err);
      }
    }
  }
}

export async function agendarTodosMedicamentos(telefone: string) {
  try {
    const response = await api.get(`/medicamentos?telefone=${telefone}`);
    const medicamentos = response.data;
    for (const med of medicamentos) await configurarAlarme({ ...med, usuarioTelefone: telefone });
  } catch (err) {
    console.error('Erro ao agendar todos os medicamentos:', err);
  }
}

