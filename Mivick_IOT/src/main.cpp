#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Arduino.h>
#include <NimBLEDevice.h>

// ================== CONFIGURAÇÃO MPU6050 ==================
Adafruit_MPU6050 mpu;
#define MPU_SDA 20
#define MPU_SCL 21
bool mpuActive = false;  // só liga com comando BLE

// ================== CONFIGURAÇÃO ULTRASSÔNICO ==================
#define TRIG_PIN 3
#define ECHO_PIN 19

// ================== CONFIGURAÇÃO BLE ==================
#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHARACTERISTIC_UUID "abcdefab-1234-1234-1234-abcdefabcdef"

NimBLECharacteristic* pCharacteristic = nullptr;
NimBLEServer* pServer = nullptr;

bool deviceConnected = false;
bool sensorActive = false;

// ================== CALLBACKS DO BLE ==================
class MyServerCallbacks : public NimBLEServerCallbacks {
  void onConnect(NimBLEServer* pServer) override {
    deviceConnected = true;
    Serial.println("🔗 Cliente BLE conectado!");
  }
  void onDisconnect(NimBLEServer* pServer) override {
    deviceConnected = false;
    sensorActive = false;
    mpuActive = false;
    Serial.println("❌ Cliente BLE desconectado!");
    NimBLEDevice::getAdvertising()->start();
    Serial.println("🔄 Recomeçando advertising BLE...");
  }
};

class MyCallbacks : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pCharacteristic) override {
    std::string value = pCharacteristic->getValue();
    Serial.print("📩 Recebido via BLE: ");
    Serial.println(value.c_str());

    if (value == "ON") {
      sensorActive = true;
      mpuActive = true;   // Ativa MPU
      Serial.println("✅ Comando ON recebido -> Sensores ativados");
    } else if (value == "OFF") {
      sensorActive = false;
      mpuActive = false;  // Desliga MPU
      Serial.println("🛑 Comando OFF recebido -> Sensores desativados");
    } else if (value == "STATUS") {
      String status = "Ultrassonico: " + String(sensorActive ? "ON" : "OFF") +
                      ", MPU: " + String(mpuActive ? "ON" : "OFF") +
                      ", BLE: " + String(deviceConnected ? "Connected" : "Disconnected");
      pCharacteristic->setValue(status.c_str());
      pCharacteristic->notify();
      Serial.println("📤 STATUS enviado via BLE");
    } else {
      Serial.println("⚠️ Comando desconhecido!");
    }
  }
};

// ================== SETUP ==================
void setup() {
  Serial.begin(115200);
  Serial.println("🚀 Iniciando ESP32...");

  // Pinos do ultrassônico
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.println("📡 Pinos do ultrassônico configurados");

  // BLE
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
  pAdvertising->start();

  Serial.println("✅ BLE iniciado e aguardando conexão...");
}

// ================== LOOP ==================
void loop() {
  // ---- Sensor Ultrassônico ----
  if (sensorActive) {
    Serial.println("📡 Lendo ultrassônico...");
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH, 30000);
    float distance_cm = (duration == 0) ? -1 : (duration / 2.0) * 0.0343;

    if (distance_cm < 0) {
      Serial.println("🌌 Nenhum objeto detectado");
    } else if (distance_cm > 100 && distance_cm <= 300) {
      Serial.printf("⚠️ Objeto a %.2f cm -> se aproximando\n", distance_cm);
    } else if (distance_cm <= 100 && distance_cm > 30) {
        Serial.printf("🚨 Objeto a %.2f cm -> próximo\n", distance_cm);
        pCharacteristic->setValue("FOTO");   // envia comando BLE
        pCharacteristic->notify();
    } else if (distance_cm <= 30) {
      Serial.printf("❗ Objeto a %.2f cm -> AO LADO\n", distance_cm);
    }
  }

  // ---- MPU6050 ----
  if (mpuActive) {
    static bool mpuInit = false;
    if (!mpuInit) {
      Serial.println("⏳ Inicializando MPU6050...");
      Wire.begin(MPU_SDA, MPU_SCL);
      if (!mpu.begin()) {
        Serial.println("❌ ERRO: Falha ao iniciar MPU6050");
      } else {
        Serial.println("✅ MPU6050 iniciado com sucesso!");
        mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
        mpu.setGyroRange(MPU6050_RANGE_500_DEG);
        mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
        mpuInit = true;
      }
    }

    if (mpuInit) {
      sensors_event_t a, g, temp;
      mpu.getEvent(&a, &g, &temp);

      Serial.printf("📊 Acelerômetro X: %.2f Y: %.2f Z: %.2f m/s²\n", a.acceleration.x, a.acceleration.y, a.acceleration.z);
      Serial.printf("📊 Giroscópio X: %.2f Y: %.2f Z: %.2f rad/s\n", g.gyro.x, g.gyro.y, g.gyro.z);

      // Detectar batida
      float accMagnitude = sqrt(a.acceleration.x * a.acceleration.x +
                                a.acceleration.y * a.acceleration.y +
                                a.acceleration.z * a.acceleration.z);

      Serial.printf("📊 Magnitude aceleração: %.2f m/s²\n", accMagnitude);

      if (accMagnitude > 15.0) { // ajuste conforme sensibilidade desejada
        Serial.println("💥 BATIDA DETECTADA!");
        pCharacteristic->setValue("BATIDA");
        pCharacteristic->notify();
      }
    }
  }

  delay(200);
}
