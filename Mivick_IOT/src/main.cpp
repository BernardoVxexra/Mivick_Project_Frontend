#include <NimBLEDevice.h>
#include <Arduino.h>

#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHARACTERISTIC_UUID "abcdefab-1234-1234-1234-abcdefabcdef"

#define TRIG_PIN 21
#define ECHO_PIN 19

NimBLECharacteristic* pCharacteristic = nullptr;
NimBLEServer* pServer = nullptr;

bool deviceConnected = false;
bool sensorActive = false;

class MyServerCallbacks : public NimBLEServerCallbacks {
  void onConnect(NimBLEServer* pServer) override {
    deviceConnected = true;
    Serial.println("🔗 Cliente BLE conectado!");
  }

  void onDisconnect(NimBLEServer* pServer) override {
    deviceConnected = false;
    sensorActive = false; // Desativa sensor ao desconectar
    Serial.println("❌ Cliente BLE desconectado!");
    NimBLEDevice::getAdvertising()->start();
    Serial.println("🔄 Aguardando nova conexão...");
  }
};

class MyCallbacks : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pCharacteristic) override {
    std::string value = pCharacteristic->getValue();
    Serial.print("Recebido via BLE: ");
    Serial.println(value.c_str());

    if (!deviceConnected) {
      Serial.println("❌ Nenhum cliente conectado");
      return;
    }

    if (value == "ON") {
      sensorActive = true;
      Serial.println("✅ Sensor ultrassônico ativado!");
    } else if (value == "STATUS") {
      String status = "Sensor: " + String(sensorActive ? "ON" : "OFF") +
                      ", BLE: " + String(deviceConnected ? "Connected" : "Disconnected");
      pCharacteristic->setValue(status.c_str());
      pCharacteristic->notify();
    } else {
      Serial.println("❓ Comando desconhecido. Use 'ON' para ativar ou 'STATUS' para status");
    }
  }
};

void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  Serial.println("🚀 Iniciando ESP32 com BLE...");

  NimBLEDevice::init("ESP32-CAM-BLE");
  pServer = NimBLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  NimBLEService* pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      NIMBLE_PROPERTY::READ |
                      NIMBLE_PROPERTY::WRITE |
                      NIMBLE_PROPERTY::NOTIFY
                    );
  pCharacteristic->setCallbacks(new MyCallbacks());
  pService->start();

  NimBLEAdvertising* pAdvertising = NimBLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  pAdvertising->start();

  Serial.println("✅ BLE iniciado!");
  Serial.println("📡 Aguardando conexão BLE...");
}

void loop() {
  if (sensorActive) {
    // Gera pulso de trigger
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH, 30000); // timeout 30ms
    float distance_cm;

    if (duration == 0) {
      distance_cm = -1;
    } else {
      distance_cm = (duration / 2.0) * 0.0343;
    }

    if (distance_cm < 0) {
      Serial.println("Nenhum obstáculo detectado");
    } else if (distance_cm > 100 && distance_cm <= 300) {
      Serial.println("⚠️ Objeto se aproximando");
    } else if (distance_cm <= 100 && distance_cm > 30) {
      Serial.println("🚨 Objeto próximo");
    } else if (distance_cm <= 30) {
      Serial.println("❗ Objeto ao lado");
    }

    delay(200); // Ajuste da frequência de leitura
  }

  // Status periódico opcional
  static unsigned long lastStatus = 0;
  if (millis() - lastStatus > 10000) {
    lastStatus = millis();
    Serial.printf("📊 Status: BLE=%s, Sensor=%s\n",
                  deviceConnected ? "Conectado" : "Desconectado",
                  sensorActive ? "Ativo" : "Inativo");
  }
}
