#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Arduino.h>

Adafruit_MPU6050 mpu;

#define MPU_SDA 2
#define MPU_SCL 3

void setup() {
  Serial.begin(115200);
  Wire.begin(MPU_SDA, MPU_SCL);  // Define os pinos I2C

  while (!Serial)
    delay(10);

  Serial.println("Iniciando MPU6050...");

  if (!mpu.begin()) {
    Serial.println("Falha ao encontrar MPU6050! Verifique conexões.");
    while (1)
      delay(10);
  }

  Serial.println("MPU6050 pronto!");
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  delay(100);
}


void loop() {
  /* Lê sensores do MPU6050 */
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  Serial.print("Acelerômetro X: "); Serial.print(a.acceleration.x); Serial.print(" m/s² ");
  Serial.print("Y: "); Serial.print(a.acceleration.y); Serial.print(" m/s² ");
  Serial.print("Z: "); Serial.println(a.acceleration.z); Serial.print(" m/s² ");

  Serial.print("Giroscópio X: "); Serial.print(g.gyro.x); Serial.print(" rad/s ");
  Serial.print("Y: "); Serial.print(g.gyro.y); Serial.print(" rad/s ");
  Serial.print("Z: "); Serial.println(g.gyro.z); Serial.print(" rad/s ");

  Serial.print("Temperatura: "); Serial.print(temp.temperature); Serial.println(" °C");

  Serial.println("---------------------------------");
  delay(500);
}
