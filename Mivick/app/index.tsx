import { View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import "./global.css";

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Conectar dispositivo" onPress={() => router.push('/ble-screen')} />
      <Button title="Hístorico " onPress={() => router.push('/historico')} />
    </View>
  );
}

// eas build -p android --profile production  (gera o app)
