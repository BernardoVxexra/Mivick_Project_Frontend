#include <Arduino.h>

#define TRIG_PIN 21
#define ECHO_PIN 19

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  Serial.println("Sensor ultrassônico inicializado. Lendo distância...");
}

void loop() {
  // Gera pulso de trigger
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Lê duração do pulso no echo
  long duration = pulseIn(ECHO_PIN, HIGH, 30000); // timeout 30ms
  float distance_cm;

  if (duration == 0) {
    distance_cm = -1; // sem retorno
  } else {
    // velocidade do som ~ 343 m/s
    distance_cm = (duration / 2.0) * 0.0343;
  }

  if (distance_cm < 0) {
    Serial.println("Nenhum obstáculo detectado");
  } else {
    Serial.print("Distância: ");
    Serial.print(distance_cm, 2);
    Serial.println(" cm");
  }

  delay(200);
}
