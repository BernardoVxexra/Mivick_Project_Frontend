#include <NimBLEDevice.h>
#include "esp_camera.h"

#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHARACTERISTIC_UUID "abcdefab-1234-1234-1234-abcdefabcdef"

// Pinos da câmera do ESP32-S3-CAM
#define PWDN_GPIO_NUM     -1
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM     10
#define SIOD_GPIO_NUM     40
#define SIOC_GPIO_NUM     39

#define Y9_GPIO_NUM       48
#define Y8_GPIO_NUM       11
#define Y7_GPIO_NUM       12
#define Y6_GPIO_NUM       14
#define Y5_GPIO_NUM       16
#define Y4_GPIO_NUM       18
#define Y3_GPIO_NUM       17
#define Y2_GPIO_NUM       15
#define VSYNC_GPIO_NUM    38
#define HREF_GPIO_NUM     47
#define PCLK_GPIO_NUM     13

NimBLECharacteristic* pCharacteristic = nullptr;
NimBLEServer* pServer = nullptr;

// Variáveis de controle
bool cameraInitialized = false;
bool deviceConnected = false;

// Declaração das funções
void sendPhoto();
void initializeCamera();

// ...existing code...
class MyServerCallbacks : public NimBLEServerCallbacks {
  void onConnect(NimBLEServer* pServer) override {
    deviceConnected = true;
    Serial.println("🔗 Cliente BLE conectado!");
    // Não inicializa a câmera aqui!
  }

  void onDisconnect(NimBLEServer* pServer) override {
    deviceConnected = false;
    Serial.println("❌ Cliente BLE desconectado!");
    if (cameraInitialized) {
      esp_camera_deinit();
      cameraInitialized = false;
      Serial.println("📷 Câmera desligada para economizar energia");
    }
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
      if (!cameraInitialized) {
        Serial.println("Comando LIGAR recebido!");
        Serial.println("📷 Inicializando câmera...");
        initializeCamera();
      }
      if (cameraInitialized) {
        Serial.println("📸 Capturando foto...");
        sendPhoto();
      }
    } else if (value == "STATUS") {
      String status = "Camera: " + String(cameraInitialized ? "ON" : "OFF") + 
                     ", BLE: " + String(deviceConnected ? "Connected" : "Disconnected");
      pCharacteristic->setValue(status.c_str());
      pCharacteristic->notify();
    } else {
      Serial.println("❓ Comando desconhecido. Use 'ON' para foto ou 'STATUS' para status");
    }
  }
};
// ...existing code...

void initializeCamera() {
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer   = LEDC_TIMER_0;
  config.pin_d0       = Y2_GPIO_NUM;
  config.pin_d1       = Y3_GPIO_NUM;
  config.pin_d2       = Y4_GPIO_NUM;
  config.pin_d3       = Y5_GPIO_NUM;
  config.pin_d4       = Y6_GPIO_NUM;
  config.pin_d5       = Y7_GPIO_NUM;
  config.pin_d6       = Y8_GPIO_NUM;
  config.pin_d7       = Y9_GPIO_NUM;
  config.pin_xclk     = XCLK_GPIO_NUM;
  config.pin_pclk     = PCLK_GPIO_NUM;
  config.pin_vsync    = VSYNC_GPIO_NUM;
  config.pin_href     = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn     = PWDN_GPIO_NUM;
  config.pin_reset    = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  config.frame_size   = FRAMESIZE_QVGA; // 320x240
  config.jpeg_quality = 10;
  config.fb_count     = 1;

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("❌ Falha ao iniciar câmera: 0x%x\n", err);
    cameraInitialized = false;
    return;
  }

  cameraInitialized = true;
  Serial.println("✅ Câmera inicializada com sucesso!");
  
  // Envia confirmação via BLE se conectado
  if (deviceConnected && pCharacteristic) {
    pCharacteristic->setValue("CAMERA_READY");
    pCharacteristic->notify();
  }
}

void sendPhoto() {
  if (!cameraInitialized) {
    Serial.println("❌ Câmera não está inicializada");
    return;
  }

  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("❌ Falha ao capturar imagem");
    if (pCharacteristic) {
      pCharacteristic->setValue("ERROR_CAPTURE_FAILED");
      pCharacteristic->notify();
    }
    return;
  }

  Serial.printf("📸 Imagem capturada (%d bytes)\n", fb->len);

  // Envia tamanho da imagem primeiro
  String sizeInfo = "SIZE:" + String(fb->len);
  pCharacteristic->setValue(sizeInfo.c_str());
  pCharacteristic->notify();
  delay(50);

  // Fragmenta a imagem em pacotes
  const size_t packetSize = 200;
  size_t totalPackets = (fb->len + packetSize - 1) / packetSize;
  
  for (size_t i = 0; i < fb->len; i += packetSize) {
    size_t currentPacket = i / packetSize + 1;
    size_t chunkSize = (i + packetSize < fb->len) ? packetSize : (fb->len - i);
    
    Serial.printf("📤 Enviando pacote %d/%d (%d bytes)\n", currentPacket, totalPackets, chunkSize);
    
    pCharacteristic->setValue(fb->buf + i, chunkSize);
    pCharacteristic->notify();
    delay(20); // Pequena pausa entre pacotes
  }

  Serial.println("✅ Imagem enviada via BLE!");
  
  // Sinal de fim de transmissão
  pCharacteristic->setValue("END_TRANSMISSION");
  pCharacteristic->notify();

  esp_camera_fb_return(fb);
}

void setup() {
  Serial.begin(115200);
  Serial.println("🚀 Iniciando ESP32-S3-CAM com BLE...");

  // Inicializa apenas o BLE
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
  Serial.println("📡 Aguardando conexão BLE para inicializar câmera...");
  Serial.println("🔍 Nome do dispositivo: ESP32-S3-CAM-BLE");
}

void loop() {
  // Status periódico (opcional)
  static unsigned long lastStatus = 0;
  if (millis() - lastStatus > 10000) { // A cada 30 segundos
    lastStatus = millis();
    Serial.printf("📊 Status: BLE=%s, Camera=%s\n", 
                  deviceConnected ? "Conectado" : "Desconectado",
                  cameraInitialized ? "Inicializada" : "Desligada");
  }
  
  delay(1000);
}
