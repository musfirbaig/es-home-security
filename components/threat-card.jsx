import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FuelIcon as GasPump, Flame, Activity, AlertCircle } from 'lucide-react'

export function ThreatCard({
  title,
  icon,
  status,
  sensorReading,
  sensorThreshold,
  temperature,
  humidity,
  ledStatus,
  buzzerStatus,
}) {
  const IconComponent = {
    "gas-pump": GasPump,
    flame: Flame,
    activity: Activity,
  }[icon];

  return (
    <Card className="bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold text-gray-800">
          {title}
        </CardTitle>
        <IconComponent className="h-6 w-6 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="mt-2 flex flex-col space-y-3">
          <Badge
            variant={status === "safe" ? "secondary" : "destructive"}
            className="w-fit"
          >
            {status === "safe" ? "Safe" : "Alert"}
          </Badge>
          {sensorReading !== undefined && sensorThreshold !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Gas Level:
              </span>
              <div className="w-2/3 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (sensorReading / sensorThreshold) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
          {temperature !== undefined && (
            <p className="text-sm text-gray-600">
              Temperature: {temperature}°C
            </p>
          )}
          {humidity !== undefined && (
            <p className="text-sm text-gray-600">Humidity: {humidity}%</p>
          )}
          <div className="flex items-center space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${
                ledStatus === "on" ? "bg-yellow-400" : "bg-gray-300"
              }`}
            />
            <span className="text-sm text-gray-600">LED</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertCircle
              className={`h-4 w-4 ${
                buzzerStatus === "on" ? "text-red-500" : "text-gray-300"
              }`}
            />
            <span className="text-sm text-gray-600">Buzzer</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
