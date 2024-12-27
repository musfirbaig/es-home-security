"use client";
import { Header } from "@/components/header";
import { ThreatCard } from "@/components/threat-card";
import { ControlPanel } from "@/components/control-panel";
import { AlertNotification } from "@/components/alert-notification";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import { MotionDetectionAlert } from "@/components/motionDetectionAlert";

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [motionDetected, setMotionDetected] = useState(false);
  const [gasSensor, setGasSensor] = useState({ level: 0, threshold: 500 });
  const [fireSensor, setFireSensor] = useState({
    temperature: 25,
    humidity: 40,
  });

  const topics = [
    "home-security/gas",
    "home-security/motion",
    "home-security/fire",
    "home-security/gas-sensor",
    "home-security/fire-sensor",
  ];

  useEffect(() => {
    const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

    client.on("connect", () => {
      console.log("Connected to HiveMQ broker");

      client.subscribe(topics, (err) => {
        if (!err) {
          console.log(`Subscribed to topics: ${topics.join(", ")}`);
        } else {
          console.error(`Failed to subscribe: ${err.message}`);
        }
      });
    });

    client.on("message", (topic, payload) => {
      const message = payload.toString();
      console.log(`Received message on topic ${topic}: ${message}`);

      if (topic === "home-security/gas-sensor") {
        const gasData = JSON.parse(message);
        setGasSensor({
          level: gasData.gasLevel,
          threshold: 500,
        });
      } else if (topic === "home-security/fire-sensor") {
        const fireData = JSON.parse(message);
        setFireSensor({
          temperature: fireData.temperature,
          humidity: fireData.humidity,
        });
      } else if (topic === "home-security/motion") {
        const motionData = JSON.parse(message);
        console.log("Motion Data", motionData);
        setMotionDetected(motionData.motion);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { topic, message },
        ]);
      }
      
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <Header />
        {/* <AlertNotification /> */}
        <AlertNotification
          gasAlert={gasSensor.level > gasSensor.threshold}
          fireAlert={fireSensor.temperature > 50}
        />

        {motionDetected && (
          <MotionDetectionAlert alertMessage={"Motion detected!"}/>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ThreatCard
            title="Gas Leakage Detection"
            icon="gas-pump"
            status={gasSensor.level > gasSensor.threshold ? "alert" : "safe"}
            sensorReading={gasSensor.level}
            sensorThreshold={gasSensor.threshold}
            ledStatus={gasSensor.level > gasSensor.threshold ? "on" : "off"}
            buzzerStatus={gasSensor.level > gasSensor.threshold ? "on" : "off"}
          />
          <ThreatCard
            title="Fire Detection"
            icon="flame"
            status={fireSensor.temperature > 50 ? "alert" : "safe"}
            temperature={fireSensor.temperature}
            humidity={fireSensor.humidity}
            ledStatus={fireSensor.temperature > 50 ? "on" : "off"}
            buzzerStatus={fireSensor.temperature > 50 ? "on" : "off"}
          />
          <ThreatCard
            title="Motion Detection"
            icon="activity"
            status="safe"
            ledStatus={motionDetected ? "on" : "off"}
            buzzerStatus={motionDetected ? "on" : "off"}
          />
        </div>
        <ControlPanel />
      </div>
    </div>
  );
}
