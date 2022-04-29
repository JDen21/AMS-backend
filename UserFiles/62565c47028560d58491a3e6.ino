#include <TinyGPS++.h>
#include <SoftwareSerial.h>

//circuit pin configurations
#define vib A0 //pin for vibration sensor
#define pulsePin A1 //pin for pulse sensor
int GPSRX = 4;
int GPSTX = 3;
 
//backend required data
String userid = "62565c47028560d58491a3e6";
String benefSim = "09754480362";
String link = "https://server-ams-backend.herokuapp.com/";
String benefid = "6239df974e2ee0719361e131";

struct backendData {
  int pulse;
  int vibration;
  double latitude;
  double longhitude;
  String uid;  
  String bid;
};
backendData data = { 0, 0, 0, 0, userid, benefid }; 


//calculation values
int maxVibration = 500;
int pulseMinThreshold = 550; // temp
int pulseMaxThreshold = 80; //temp



//libraries
TinyPGSPlus gps;
SoftwareSerial gpsSerial(GPSRX, GPSTX);

void setup() { 
Serial.begin(9600);
gpsSerial.begin(9600);
pinMode(vib, INPUT);

}

void loop() {
  bool vibration = vibrateCheck(vib, maxVibration);
  bool pulse = pulseCheck(pulsePin, pulseMaxThreshold, pulseMinThreshold);

////  TEST FOR VIBRATION
//  Serial.println(vibration);
//  delay(500);

////TEST FOR PULSE
//  Serial.println(pulse);
//  delay(10);

}

bool pulseCheck(int pin, int maxThreshold, int minThreshold){
  int val = analogRead(pin);
  data.pulse = val
  if(val > maxThreshold)
    return true;
  if(val < minThreshold)
    return true;
  return false;
}


bool vibrateCheck(int pin, int maxVib){

  int val = analogRead(pin);
  data.vibration = val;
  if(val >= maxVib)
    return true;
  return false;
  }

void gpsData(){
  if(gpsSerial.available() > 0){
     gps.encode(gpsSerial.read());
     data.latitude = gps.location.lat();
     data.longhitude = gps.location.lng();
  }
}

void sendOnAccident(){
  
}

void sendOnConnect(){
  
}
