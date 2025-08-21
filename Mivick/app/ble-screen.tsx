import React, { useState, useEffect } from 'react';
import { View, Button, Text, PermissionsAndroid, Platform, Alert } from 'react-native';
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { useNavigation } from '@react-navigation/native';

const SERVICE_UUID = '12345678-1234-1234-1234-123456789abc';
const CHARACTERISTIC_UUID = 'abcdefab-1234-1234-1234-abcdefabcdef';
const DEVICE_NAME = 'ESP32-CAM-BLE';

global.Buffer = global.Buffer || Buffer;

export default function BleScreen() {
  const [manager] = useState(() => new BleManager());
  const [device, setDevice] = useState<Device | null>(null);
  const [connected, setConnected] = useState(false);
  const [imageChunks, setImageChunks] = useState<string[]>([]);
  const navigation = useNavigation<any>();
  let subscription: any = null;

  useEffect(() => {
    const run = async () => {
      await startScan();
    };

    run();

    return () => {
      console.log("🧹 Limpando BLE...");
      if (subscription) {
        subscription.remove();
        console.log("🔌 Listener removido");
      }
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  async function requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;
    if (Platform.Version >= 31) {
      const perms = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ];
      const result = await PermissionsAndroid.requestMultiple(perms as any);
      return Object.values(result).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }

  async function startScan() {
    const ok = await requestPermissions();
    if (!ok) return;

    manager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.error('❌ Scan error', error);
        return;
      }
      if (scannedDevice && scannedDevice.name === DEVICE_NAME) {
        console.log("📡 Encontrado:", scannedDevice.name);
        manager.stopDeviceScan();
        connectToDevice(scannedDevice);
      }
    });
  }

  async function connectToDevice(dev: Device) {
    try {
      const connectedDevice = await dev.connect();
      setConnected(true);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      setDevice(connectedDevice);
      console.log('✅ Conectado a', connectedDevice.name);

      // Ativar notificações com unsubscribe
      subscription = connectedDevice.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic: Characteristic | null) => {
          if (error) {
            console.error('❌ Erro monitor:', error);
            return;
          }
          if (characteristic?.value) {
            const chunk = Buffer.from(characteristic.value, 'base64').toString('binary');

            // Evita estourar memória
            setImageChunks(prev => {
              const next = [...prev, chunk];
              if (next.length > 10000) { 
                console.warn("⚠️ Muitos pacotes acumulados, limpando buffer!");
                return [];
              }
              return next;
            });
          }
        }
      );

    } catch (e) {
      console.error('❌ Erro ao conectar:', e);
      Alert.alert('Erro', 'Falha ao conectar ao dispositivo.');
    }
  }

  async function enviarComando(cmd: string) {
    if (!device || !connected) return;
    try {
      await device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        Buffer.from(cmd, 'utf-8').toString('base64')
      );
      console.log('📤 Comando enviado:', cmd);

      if (cmd === 'ON') {
        setTimeout(() => {
          if (imageChunks.length === 0) {
            console.warn("⚠️ Nenhum pacote recebido!");
            return;
          }
          try {
            const fullBinary = imageChunks.join('');
            const base64Image = Buffer.from(fullBinary, 'binary').toString('base64');
            console.log("🖼️ Imagem montada, tamanho:", base64Image.length);
            navigation.navigate('historico', { image: `data:image/jpeg;base64,${base64Image}` });
          } catch (err) {
            console.error("❌ Erro ao converter imagem:", err);
          }
          setImageChunks([]); // limpa buffer
        }, 3000);
      }
    } catch (e) {
      console.error('❌ Erro ao enviar comando:', e);
      Alert.alert('Erro', 'Falha ao enviar comando.');
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Conectado: {connected && device ? device.name : 'Não'}</Text>
      <View style={{ height: 12 }} />
      <Button title="Ligar" onPress={() => enviarComando('ON')} />
      <View style={{ height: 8 }} />
      <Button title="Desligar" onPress={() => enviarComando('OFF')} />
    </View>
  );
}
