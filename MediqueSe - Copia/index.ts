import { registerRootComponent } from 'expo';
import App from './App';
import notifee, { EventType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

registerRootComponent(App);

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS && detail.notification?.data) {
    await AsyncStorage.setItem(
      'notificacaoPendente',
      JSON.stringify(detail.notification.data)
    );
  }
});
