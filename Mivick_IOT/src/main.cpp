#include <NimBLEDevice.h>
#include "esp_camera.h"
#include "WiFi.h"

bool sistemaAtivo = false;

// Protótipos
void ligarFuncoes();
void desligarFuncoes();

// ==== Configuração da câmera (ajuste para seu modelo) ====
#define PWDN_GPIO_NUM    -1
#define RESET_GPIO_NUM   -1
#define XCLK_GPIO_NUM    21
#define SIOD_GPIO_NUM    22
#define SIOC_GPIO_NUM    23

#define Y9_GPIO_NUM      36
#define Y8_GPIO_NUM      37
#define Y7_GPIO_NUM      38
#define Y6_GPIO_NUM      39
#define Y5_GPIO_NUM      40
#define Y4_GPIO_NUM      41
#define Y3_GPIO_NUM      42
#define Y2_GPIO_NUM      43
#define VSYNC_GPIO_NUM   44
#define HREF_GPIO_NUM    45
#define PCLK_GPIO_NUM    46

#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHARACTERISTIC_UUID "abcdefab-1234-1234-1234-abcdefabcdef"

NimBLEServer* pServer = nullptr;
NimBLECharacteristic* pCharacteristic = nullptr;

class MyCallbacks : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pCharacteristic) override {
    std::string value = pCharacteristic->getValue();

    if (value == "ON") {
      if (!sistemaAtivo) {
        sistemaAtivo = true;
        ligarFuncoes();
        pCharacteristic->setValue("Sistema ativado");
        pCharacteristic->notify();
      }
    } else if (value == "OFF") {
      if (sistemaAtivo) {
        sistemaAtivo = false;
        desligarFuncoes();
        pCharacteristic->setValue("Sistema desativado");
        pCharacteristic->notify();
      }
    }
  }
};

void iniciarCamera() {
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

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("❌ Erro ao iniciar a câmera");
  } else {
    Serial.println("📷 Câmera iniciada");
  }
}

void ligarFuncoes() {
  Serial.println("Ligando sensores, camera, wifi...");
  iniciarCamera();
  WiFi.begin("SSID","SENHA");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado");
}

void desligarFuncoes() {
  Serial.println("Desligando tudo...");
  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);
  // desligar sensores etc
}

void setup() {
  Serial.begin(115200);

  NimBLEDevice::init("ESP32-CAM-BLE");

  pServer = NimBLEDevice::createServer();

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

  Serial.println("Aguardando comandos via BLE...");
}

void loop() {
  // Outras tarefas aqui
}
