#include <NimBLEDevice.h>

#define SERVICE_UUID        "12345678-1234-1234-1234-123456789abc"
#define CHARACTERISTIC_UUID "abcdefab-1234-1234-1234-abcdefabcdef"

NimBLECharacteristic* pCharacteristic = nullptr;

class MyCallbacks : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pCharacteristic) override {
    std::string value = pCharacteristic->getValue();

    Serial.print("Recebido via BLE: ");
    Serial.println(value.c_str());

    if (value == "ON") {
      Serial.println("Comando ON recebido");
    } else if (value == "OFF") {
      Serial.println("Comando OFF recebido");
    } else {
      Serial.println("Comando desconhecido");
    }
  }
};

void setup() {
  Serial.begin(115200);

  NimBLEDevice::init("ESP32-CAM-BLE");

  NimBLEServer* pServer = NimBLEDevice::createServer();
  NimBLEService* pService = pServer->createService(SERVICE_UUID);

  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      NIMBLE_PROPERTY::READ |
                      NIMBLE_PROPERTY::WRITE
                    );

  pCharacteristic->setCallbacks(new MyCallbacks());
  pService->start();

  NimBLEAdvertising* pAdvertising = NimBLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();

  Serial.println("Aguardando comandos via BLE...");
}

void loop() {
  // Pode adicionar outras tarefas aqui, se quiser
}
