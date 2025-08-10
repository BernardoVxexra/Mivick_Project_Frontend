import React, { useState, useEffect } from 'react';
import { View, Button, Text, PermissionsAndroid, Platform, Alert } from 'react-native';
import { BleManager, Device, State } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";
const CHARACTERISTIC_UUID = "abcdefab-1234-1234-1234-abcdefabcdef";
const DEVICE_NAME = "ESP32-CAM-BLE";

export default function App() {
  const [manager] = useState(() => new BleManager());
  const [device, setDevice] = useState<Device | null>(null);
  const [connected, setConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Garante que Buffer esteja disponível globalmente
  global.Buffer = global.Buffer || Buffer;

  useEffect(() => {
    // Monitorar estado do Bluetooth
    const subscription = manager.onStateChange((state) => {
      console.log("Estado Bluetooth:", state);
      if (state === State.PoweredOn) {
        startScan();
      }
    }, true);

    return () => {
      subscription.remove();
      manager.destroy();
    };
  }, [manager]);

  async function requestPermissions() {
    if (Platform.OS !== 'android') return true;

    if (Platform.Version >= 31) {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      const allGranted = permissions.every(
        (perm) => granted[perm] === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        Alert.alert("Permissões necessárias", "Por favor, permita as permissões de Bluetooth e localização.");
        return false;
      }
      return true;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permissão de localização negada", "Não é possível escanear dispositivos BLE.");
        return false;
      }
      return true;
    }
  }

  async function startScan() {
    if (isScanning) return; // evita múltiplos scans

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsScanning(true);
    console.log("Iniciando scan...");

    manager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.error("Erro no scan:", error);
        setIsScanning(false);
        return;
      }
      if (scannedDevice && scannedDevice.name === DEVICE_NAME) {
        console.log("Dispositivo encontrado:", scannedDevice.name);
        manager.stopDeviceScan();
        setIsScanning(false);
        setDevice(scannedDevice);
        connectToDevice(scannedDevice);
      }
    });

    // Timeout para parar o scan caso nada seja encontrado
    setTimeout(() => {
      if (isScanning) {
        console.log("Timeout scan: parando scan");
        manager.stopDeviceScan();
        setIsScanning(false);
      }
    }, 15000); // 15 segundos
  }

  async function connectToDevice(dev: Device) {
    try {
      console.log("Conectando ao dispositivo...");
      const connectedDevice = await dev.connect();
      setConnected(true);
      console.log("Dispositivo conectado:", connectedDevice.name);
      await connectedDevice.discoverAllServicesAndCharacteristics();
    } catch (e) {
      console.error('Erro ao conectar:', e);
      setConnected(false);
      Alert.alert("Falha na conexão", "Não foi possível conectar ao dispositivo BLE.");
    }
  }

  async function enviarComando(cmd: string) {
    if (!device || !connected) {
      Alert.alert("Não conectado", "Nenhum dispositivo BLE conectado.");
      return;
    }

    try {
      await device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        Buffer.from(cmd + "\n", "utf-8").toString("base64")
      );
      console.log("Comando enviado:", cmd);
    } catch (e) {
      console.error("Erro ao enviar comando:", e);
      Alert.alert("Erro", "Falha ao enviar comando.");
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Conectado: {connected && device ? device.name : "Não"}</Text>
      <Button title="Ligar" onPress={() => enviarComando("ON")} />
      <Button title="Desligar" onPress={() => enviarComando("OFF")} />
      <Button title="Escanear" onPress={() => startScan()} disabled={isScanning} />
      {isScanning && <Text>Escaneando dispositivos...</Text>}
    </View>
  );
}
