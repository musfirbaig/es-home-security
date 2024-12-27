import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wifi } from 'lucide-react'

export function Header() {
  return (
    (<Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-gray-800">Home Security Dashboard</CardTitle>
        <div className="flex items-center space-x-2">
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-600">MQTT Connected</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* <p className="text-sm text-gray-500">Last update: {new Date().toLocaleString()}</p> */}
      </CardContent>
    </Card>)
  );
}

