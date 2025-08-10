import React, { useState, useEffect } from 'react';
import { View, Button, Text, PermissionsAndroid, Platform } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const SERVICE_UUID = "12345678-1234-1234-1234-123456789abc";
const CHARACTERISTIC_UUID = "abcdefab-1234-1234-1234-abcdefabcdef";
const DEVICE_NAME = "ESP32-CAM-BLE";

export default function App() {
  const [manager] = useState(() => new BleManager());
  const [device, setDevice] = useState<Device | null>(null);
  const [connected, setConnected] = useState(false);

  // Garante que Buffer esteja disponível globalmente
  global.Buffer = global.Buffer || Buffer;

  useEffect(() => {
    async function startScan() {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn("Permissão de localização negada");
          return;
        }
      }

      manager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) {
          console.error(error);
          return;
        }
        if (scannedDevice && scannedDevice.name === DEVICE_NAME) {
          manager.stopDeviceScan();
          setDevice(scannedDevice);
          connectToDevice(scannedDevice);
        }
      });
    }

    async function connectToDevice(dev: Device) {
      try {
        const connectedDevice = await dev.connect();
        setConnected(true);
        await connectedDevice.discoverAllServicesAndCharacteristics();
      } catch (e) {
        console.error('Erro ao conectar:', e);
      }
    }

    startScan();

    return () => {
      manager.destroy();
    };
  }, [manager]);

  async function enviarComando(cmd: string) {
    if (!device || !connected) return;

    try {
      await device.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        Buffer.from(cmd + "\n", "utf-8").toString("base64")
      );
      console.log("Comando enviado:", cmd);
    } catch (e) {
      console.error("Erro ao enviar comando:", e);
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Conectado: {connected && device ? device.name : "Não"}</Text>
      <Button title="Ligar" onPress={() => enviarComando("ON")} />
      <Button title="Desligar" onPress={() => enviarComando("OFF")} />
    </View>
  );
}
