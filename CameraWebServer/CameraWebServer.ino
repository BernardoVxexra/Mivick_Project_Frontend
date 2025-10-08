#include <Wire.h>
#include <Arduino.h>
#include <NimBLEDevice.h>
#include <MPU6050_light.h>
#include "esp_camera.h"
#include "board_config.h"  // Configura o modelo da câmera
#include <WiFi.h>
#include <ArduinoWebsockets.h>

const char* ssid = "Uai Fai";
const char* password = "Rhema@1103";
const char* websocket_server = "192.168.1.6";  // IP do celular
const int websocket_port = 8080;


WebsocketsClient wsClient;  // ✅ Nome correto do objeto
// ================== CONFIGURAÇÃO MPU6050 ==================
MPU6050 mpu(Wire);
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


/*
void sendPhotoBLE() {
  if (!deviceConnected) return;

  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) return;

  const size_t chunkSize = 200;
  for (size_t i = 0; i < fb->len; i += chunkSize) {
    size_t len = ((i + chunkSize) > fb->len) ? (fb->len - i) : chunkSize;
    std::string chunk((char*)fb->buf + i, len);
    pCharacteristic->setValue(chunk);
    pCharacteristic->notify();
    delay(10);
  }

  // Enviar pacote final indicando fim
  pCharacteristic->setValue("END");
  pCharacteristic->notify();

  esp_camera_fb_return(fb);
  Serial.println("🖼️ Foto enviada via BLE!");
}
*/
void sendPhotoWS() {
  camera_fb_t *fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("❌ Falha ao capturar imagem");
    return;
  }

  Serial.printf("📤 Enviando foto (%d bytes)...\n", fb->len);
  wsClient.sendBinary((const char*)fb->buf, fb->len);  // ✅ Envio direto, sem Base64
  esp_camera_fb_return(fb);
  Serial.println("✅ Foto enviada via WebSocket!");
}

// ===========================
// Inicialização da câmera
// ===========================
void startCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;  
  config.frame_size = FRAMESIZE_UXGA;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  if (psramFound()) {
    config.jpeg_quality = 10;
    config.fb_count = 2;
    config.grab_mode = CAMERA_GRAB_LATEST;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.fb_location = CAMERA_FB_IN_DRAM;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x\n", err);
    return;
  }

  sensor_t *s = esp_camera_sensor_get();
  if (s->id.PID == OV3660_PID) {
    s->set_vflip(s, 1);
    s->set_brightness(s, 1);
    s->set_saturation(s, -2);
  }

  if (config.pixel_format == PIXFORMAT_JPEG) {
    s->set_framesize(s, FRAMESIZE_QVGA);
  }

#if defined(CAMERA_MODEL_M5STACK_WIDE) || defined(CAMERA_MODEL_M5STACK_ESP32CAM)
  s->set_vflip(s, 1);
  s->set_hmirror(s, 1);
#endif



#if defined(LED_GPIO_NUM)
  setupLedFlash();
#endif
}






// ================== SETUP ==================
void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  startCamera();
  Serial.println("🚀 Iniciando ESP32...");

 WiFi.begin(ssid, password);
  Serial.print("Conectando Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\n✅ Wi-Fi conectado!");
  Serial.println(WiFi.localIP());

wsClient.onEvent([](WebsocketsEvent event, String data){
  if (event == WebsocketsEvent::ConnectionOpened) {
    Serial.println("🔗 Conectado ao app via WebSocket!");
  } else if (event == WebsocketsEvent::ConnectionClosed) {
    Serial.println("❌ Conexão WebSocket encerrada");
  } else if (event == WebsocketsEvent::GotPing) {
    Serial.println("📡 Ping recebido");
  } else if (event == WebsocketsEvent::GotPong) {
    Serial.println("📡 Pong recebido");
  }
});

if (wsClient.connect(websocket_server, websocket_port, "/")) {
  Serial.println("🌐 Conectado ao app Expo via WebSocket!");
} else {
  Serial.println("❌ Falha ao conectar ao servidor WebSocket");
}


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
  wsClient.poll(); // ✅ Faz o client WebSocket processar mensagens

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
      sendPhotoWS();
      delay(500); // evita múltiplas fotos consecutivas
      pCharacteristic->notify();
  
    } else if (distance_cm <= 30) {
      sendPhotoWS();
      delay(500); // evita múltiplas fotos consecutivas
      pCharacteristic->notify();
      Serial.printf("❗ Objeto a %.2f cm -> AO LADO\n", distance_cm);
    }
  }

  // ---- MPU6050 ----
 if (mpuActive) {
  static bool mpuInit = false;
  if (!mpuInit) {
    Serial.println("⏳ Inicializando MPU6050...");
    Wire.begin(MPU_SDA, MPU_SCL);
    byte status = mpu.begin();
    if (status != 0) {
      Serial.print("❌ ERRO MPU6050: ");
      Serial.println(status);
    } else {
      Serial.println("✅ MPU6050 iniciado com sucesso!");
      mpu.calcOffsets(true, true); // calibra
      mpuInit = true;
    }
  }

  if (mpuInit) {
    mpu.update();
    Serial.printf("📊 Acelerômetro X: %.2f Y: %.2f Z: %.2f m/s²\n", mpu.getAccX(), mpu.getAccY(), mpu.getAccZ());
    Serial.printf("📊 Giroscópio X: %.2f Y: %.2f Z: %.2f °/s\n", mpu.getGyroX(), mpu.getGyroY(), mpu.getGyroZ());

    float accMagnitude = sqrt(
      mpu.getAccX() * mpu.getAccX() +
      mpu.getAccY() * mpu.getAccY() +
      mpu.getAccZ() * mpu.getAccZ()
    );

    Serial.printf("📊 Magnitude aceleração: %.2f m/s²\n", accMagnitude);

    if (accMagnitude > 15.0) {
      Serial.println("💥 BATIDA DETECTADA!");
      pCharacteristic->setValue("BATIDA");
      pCharacteristic->notify();
    }
  }
}
  delay(200);
}
