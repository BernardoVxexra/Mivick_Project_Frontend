import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, PermissionsAndroid, Platform, Alert } from 'react-native';
import { BleManager, Device, Characteristic } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
const SERVICE_UUID = '12345678-1234-1234-1234-123456789abc';
const CHARACTERISTIC_UUID = 'abcdefab-1234-1234-1234-abcdefabcdef';
const DEVICE_NAME = 'ESP32-CAM-BLE';

global.Buffer = global.Buffer || Buffer;

export default function BleScreen() {
  const [manager] = useState(() => new BleManager());
  const [device, setDevice] = useState<Device | null>(null);
  const [connected, setConnected] = useState(false);
  const [eventoPendentes, setEventoPendentes] = useState({ batida: false, foto: false });
  const navigation = useNavigation<any>();
  const subscriptionRef = useRef<any>(null);
   const bufferFoto = useRef<Uint8Array[]>([]);
const router = useRouter();


  useEffect(() => {
    startScan();
    // ❌ NÃO desconecta mais automaticamente
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
      if (error) return console.error('❌ Scan error', error);
      if (scannedDevice?.name === DEVICE_NAME) {
        console.log("📡 Encontrado:", scannedDevice.name);
        manager.stopDeviceScan();
        connectToDevice(scannedDevice);
      }
    });
  }

  async function connectToDevice(dev: Device) {
    try {
      const connectedDevice = await dev.connect();
      await connectedDevice.discoverAllServicesAndCharacteristics();
      setDevice(connectedDevice);
      setConnected(true);
      console.log('✅ Conectado a', connectedDevice.name);

      // Mantém conexão ativa
 subscriptionRef.current = connectedDevice.monitorCharacteristicForService(
  SERVICE_UUID,
  CHARACTERISTIC_UUID,
  async (error, characteristic) => {
    if (error) return console.error(error);
    if (!characteristic?.value) return;

    const msg = Buffer.from(characteristic.value, 'base64').toString('utf-8');
    if (msg === 'END') {
      const totalLength = bufferFoto.current.reduce((sum, arr) => sum + arr.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      bufferFoto.current.forEach(arr => {
        combined.set(arr, offset);
        offset += arr.length;
      });

      const base64Image = Buffer.from(combined).toString('base64');
      bufferFoto.current = [];

      router.push({
        pathname: '/historico',
        params: { image: `data:image/jpeg;base64,${base64Image}?t=${Date.now()}` },
      });
    } else {
      bufferFoto.current.push(Buffer.from(characteristic.value, 'base64'));
    }
  }
);

    } catch (e) {
      console.error('❌ Erro ao conectar:', e);
      Alert.alert('Erro', 'Falha ao conectar ao dispositivo.');
    }
  }

  async function desconectar() {
    try {
      if (subscriptionRef.current) subscriptionRef.current.remove();
      if (device) await device.cancelConnection();
      setConnected(false);
      setDevice(null);
      Alert.alert('BLE', 'Desconectado com sucesso.');
    } catch (err) {
      console.error('❌ Erro ao desconectar:', err);
    }
  }

  /*async function pegarFotoDaCamera() {
    try {
      const res = await fetch(`http://${CAMERA_IP}/photo`);
      const blob = await res.blob();
      const base64Image = await blobToBase64(blob);
      console.log("🖼️ Foto recebida, tamanho base64:", base64Image.length);
      navigation.navigate('historico', { image: `data:image/jpeg;base64,${base64Image}` });
    } catch (err) {
      console.error("❌ Erro ao buscar foto:", err);
      Alert.alert('Erro', 'Falha ao capturar foto da câmera.');
    }
  }
*/
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
    } catch (e) {
      console.error('❌ Erro ao enviar comando:', e);
      Alert.alert('Erro', 'Falha ao enviar comando.');
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Conectado: {connected && device ? device.name : 'Não'}</Text>
      <View style={{ height: 12 }} />
      <Button title="Ligar sensores" onPress={() => enviarComando('ON')} />
      <View style={{ height: 8 }} />
      <Button title="Desligar sensores" onPress={() => enviarComando('OFF')} />
      <View style={{ height: 8 }} />
      {connected && (
        <Button title="Desconectar" color="red" onPress={desconectar} />
      )}
    </View>
  );
}
