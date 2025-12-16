"use client";
import { Header } from "@/components/header";
import { ThreatCard } from "@/components/threat-card";
import { ControlPanel } from "@/components/control-panel";
import { AlertNotification } from "@/components/alert-notification";
import mqtt from "mqtt";
import { useEffect, useState } from "react";
import { MotionDetectionAlert } from "@/components/motionDetectionAlert";
import { Card } from "@/components/ui/card";
import { AreaChart, DonutChart, LineChart } from "@tremor/react";

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [motionDetected, setMotionDetected] = useState(false);
  const [gasSensor, setGasSensor] = useState({ level: 0, threshold: 500 });
  const [fireSensor, setFireSensor] = useState({
    temperature: 25,
    humidity: 40,
  });

  // Sample data for 24-hour sensor monitoring (40 data points)
  const sensorTimelineData = [
    { time: "00:00", Temperature: 22, "Gas Level": 180, "Motion Events": 0 },
    { time: "00:45", Temperature: 21, "Gas Level": 165, "Motion Events": 0 },
    { time: "01:30", Temperature: 21, "Gas Level": 175, "Motion Events": 0 },
    { time: "02:15", Temperature: 20, "Gas Level": 190, "Motion Events": 0 },
    { time: "03:00", Temperature: 20, "Gas Level": 185, "Motion Events": 1 },
    { time: "03:45", Temperature: 19, "Gas Level": 170, "Motion Events": 0 },
    { time: "04:30", Temperature: 19, "Gas Level": 165, "Motion Events": 0 },
    { time: "05:15", Temperature: 20, "Gas Level": 195, "Motion Events": 0 },
    { time: "06:00", Temperature: 21, "Gas Level": 210, "Motion Events": 2 },
    { time: "06:45", Temperature: 23, "Gas Level": 245, "Motion Events": 3 },
    { time: "07:30", Temperature: 24, "Gas Level": 280, "Motion Events": 5 },
    { time: "08:15", Temperature: 26, "Gas Level": 320, "Motion Events": 8 },
    { time: "09:00", Temperature: 27, "Gas Level": 355, "Motion Events": 6 },
    { time: "09:45", Temperature: 28, "Gas Level": 385, "Motion Events": 4 },
    { time: "10:30", Temperature: 30, "Gas Level": 410, "Motion Events": 3 },
    { time: "11:15", Temperature: 31, "Gas Level": 445, "Motion Events": 2 },
    { time: "12:00", Temperature: 33, "Gas Level": 490, "Motion Events": 4 },
    { time: "12:45", Temperature: 34, "Gas Level": 530, "Motion Events": 5 },
    { time: "13:30", Temperature: 35, "Gas Level": 515, "Motion Events": 3 },
    { time: "14:15", Temperature: 36, "Gas Level": 485, "Motion Events": 2 },
    { time: "15:00", Temperature: 35, "Gas Level": 465, "Motion Events": 3 },
    { time: "15:45", Temperature: 34, "Gas Level": 440, "Motion Events": 4 },
    { time: "16:30", Temperature: 32, "Gas Level": 420, "Motion Events": 6 },
    { time: "17:15", Temperature: 30, "Gas Level": 395, "Motion Events": 8 },
    { time: "18:00", Temperature: 28, "Gas Level": 380, "Motion Events": 12 },
    { time: "18:45", Temperature: 27, "Gas Level": 365, "Motion Events": 15 },
    { time: "19:30", Temperature: 26, "Gas Level": 340, "Motion Events": 10 },
    { time: "20:15", Temperature: 25, "Gas Level": 315, "Motion Events": 8 },
    { time: "21:00", Temperature: 24, "Gas Level": 290, "Motion Events": 6 },
    { time: "21:45", Temperature: 23, "Gas Level": 265, "Motion Events": 4 },
    { time: "22:30", Temperature: 23, "Gas Level": 240, "Motion Events": 2 },
    { time: "23:15", Temperature: 22, "Gas Level": 210, "Motion Events": 1 },
    { time: "23:45", Temperature: 22, "Gas Level": 195, "Motion Events": 0 },
  ];

  // Threat detection distribution data
  const threatDistributionData = [
    { name: "Gas Alerts", value: 8 },
    { name: "Fire Alerts", value: 5 },
    { name: "Motion Detected", value: 23 },
    { name: "No Threat", value: 64 },
  ];

  // Security status over time (35 data points)
  const securityStatusData = [
    { hour: "00:00", Safe: 100, Alert: 0 },
    { hour: "01:00", Safe: 100, Alert: 0 },
    { hour: "02:00", Safe: 100, Alert: 0 },
    { hour: "03:00", Safe: 95, Alert: 5 },
    { hour: "04:00", Safe: 100, Alert: 0 },
    { hour: "05:00", Safe: 100, Alert: 0 },
    { hour: "06:00", Safe: 90, Alert: 10 },
    { hour: "07:00", Safe: 85, Alert: 15 },
    { hour: "08:00", Safe: 80, Alert: 20 },
    { hour: "09:00", Safe: 75, Alert: 25 },
    { hour: "10:00", Safe: 70, Alert: 30 },
    { hour: "11:00", Safe: 65, Alert: 35 },
    { hour: "12:00", Safe: 55, Alert: 45 },
    { hour: "13:00", Safe: 60, Alert: 40 },
    { hour: "14:00", Safe: 65, Alert: 35 },
    { hour: "15:00", Safe: 70, Alert: 30 },
    { hour: "16:00", Safe: 75, Alert: 25 },
    { hour: "17:00", Safe: 70, Alert: 30 },
    { hour: "18:00", Safe: 60, Alert: 40 },
    { hour: "19:00", Safe: 65, Alert: 35 },
    { hour: "20:00", Safe: 75, Alert: 25 },
    { hour: "21:00", Safe: 80, Alert: 20 },
    { hour: "22:00", Safe: 90, Alert: 10 },
    { hour: "23:00", Safe: 95, Alert: 5 },
  ];

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
        

        {/* Analytics Dashboard Section */}
        <div className="space-y-6 mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Security Analytics
              </h2>
              <p className="text-gray-500 mt-1">
                Real-time data analysis and threat patterns from your IoT sensors
              </p>
            </div>
          </div>

          {/* Chart Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* 24-Hour Sensor Timeline */}
            <Card className="p-6 col-span-2">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                24-Hour Sensor Activity Timeline
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Temperature (°C), Gas levels (PPM), and Motion events tracked throughout the day
              </p>
              <LineChart
                data={sensorTimelineData}
                index="time"
                categories={["Temperature", "Gas Level", "Motion Events"]}
                colors={["amber", "rose", "blue"]}
                valueFormatter={(value) => `${value}`}
                yAxisWidth={40}
                showLegend={true}
                showGridLines={true}
                showAnimation={true}
                curveType="natural"
                className="h-80"
              />
              <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500">Peak Temperature</p>
                  <p className="text-lg font-semibold text-amber-600">36°C at 14:15</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Max Gas Level</p>
                  <p className="text-lg font-semibold text-rose-600">530 PPM at 12:45</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Motion Events</p>
                  <p className="text-lg font-semibold text-blue-600">127 detections</p>
                </div>
              </div>
            </Card>

            {/* Threat Distribution */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Threat Detection Distribution
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Breakdown of security events detected over the last 24 hours
              </p>
              <DonutChart
                data={threatDistributionData}
                category="value"
                index="name"
                valueFormatter={(value) => `${value} events`}
                colors={["rose", "orange", "blue", "emerald"]}
                variant="donut"
                showAnimation={true}
                showLabel={true}
                className="h-60"
              />
              <div className="mt-6 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">System Status:</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    64% Safe Operations
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Alert Rate:</span>
                  <span className="text-sm font-semibold text-gray-900">36% Detection Rate</span>
                </div>
              </div>
            </Card>

            {/* Security Status Over Time */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Security Status Timeline
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Hourly comparison of safe periods vs. alert conditions
              </p>
              <AreaChart
                data={securityStatusData}
                index="hour"
                categories={["Safe", "Alert"]}
                colors={["emerald", "rose"]}
                valueFormatter={(value) => `${value}%`}
                yAxisWidth={40}
                showLegend={true}
                showGridLines={false}
                showAnimation={true}
                stack={true}
                className="h-60"
              />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <p className="text-xs text-emerald-600 font-medium">Safest Period</p>
                  <p className="text-lg font-bold text-emerald-700">00:00 - 05:00</p>
                  <p className="text-xs text-emerald-600">99% safe</p>
                </div>
                <div className="bg-rose-50 p-3 rounded-lg">
                  <p className="text-xs text-rose-600 font-medium">Peak Alert Period</p>
                  <p className="text-lg font-bold text-rose-700">12:00 - 13:00</p>
                  <p className="text-xs text-rose-600">45% alerts</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Key Insights Section */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              Key Insights & Recommendations
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-semibold text-gray-900">Peak Activity Hours</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Motion detection peaks during 6:00-9:00 AM and 5:00-7:00 PM, correlating with occupancy patterns.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-gray-900">Gas Level Warning</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Gas levels exceeded threshold at 12:45 PM (530 PPM). Consider ventilation improvements during midday.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌡️</span>
                  <div>
                    <p className="font-semibold text-gray-900">Temperature Trends</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Temperature rises steadily from morning (20°C) to afternoon peak (36°C). AC system optimization recommended.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <ControlPanel />
      </div>
    </div>
  );
}
