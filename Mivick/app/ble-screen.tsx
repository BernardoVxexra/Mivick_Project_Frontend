import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Text, Alert, Image, ScrollView } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { useRouter } from 'expo-router';

const SERVICE_UUID = '12345678-1234-1234-1234-123456789abc';
const CHARACTERISTIC_UUID = 'abcdefab-1234-1234-1234-abcdefabcdef';
const DEVICE_NAME = 'ESP32-CAM-BLE';
const ESP32_WS_IP = 'ws://192.168.1.10:80/ws'; // IP do ESP32

global.Buffer = global.Buffer || Buffer;

export default function BleScreen() {
  const [manager] = useState(() => new BleManager());
  const [device, setDevice] = useState<Device | null>(null);
  const [connected, setConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    startScan();
  }, []);

  // ================= BLE =================
  async function startScan() {
    manager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) return console.error('❌ Scan error', error);
      if (scannedDevice?.name === DEVICE_NAME) {
        console.log('📡 Encontrado:', scannedDevice.name);
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
    } catch (e) {
      console.error('❌ Erro ao conectar BLE:', e);
      Alert.alert('Erro', 'Falha ao conectar ao dispositivo BLE.');
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
    } catch (e) {
      console.error('❌ Erro ao enviar comando:', e);
      Alert.alert('Erro', 'Falha ao enviar comando.');
    }
  }

  // ================= WebSocket =================
  useEffect(() => {
    const socket = new WebSocket(ESP32_WS_IP);

    socket.onopen = () => {
      console.log('🌐 Conectado ao ESP32 via WebSocket!');
    };

    socket.onmessage = (event) => {
      console.log('🖼️ Dados recebidos via WebSocket');
      const base64Image = event.data as string; // ESP32 envia JPEG em base64
      setImages((prev) => [...prev, `data:image/jpeg;base64,${base64Image}?t=${Date.now()}`]);
    };

    socket.onclose = () => console.log('❌ Conexão WebSocket encerrada');
    socket.onerror = (err) => console.error('❌ WebSocket erro:', err);

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text>Conectado BLE: {connected && device ? device.name : 'Não'}</Text>
      <View style={{ height: 12 }} />
      <Button title="Ligar sensores" onPress={() => enviarComando('ON')} />
      <View style={{ height: 8 }} />
      <Button title="Desligar sensores" onPress={() => enviarComando('OFF')} />
      <View style={{ height: 12 }} />
      <Text>Fotos recebidas:</Text>
      {images.map((img, idx) => (
        <Image
          key={idx}
          source={{ uri: img }}
          style={{ width: 300, height: 200, marginVertical: 8 }}
        />
      ))}
    </ScrollView>
  );
}
