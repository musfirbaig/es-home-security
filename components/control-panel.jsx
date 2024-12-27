import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function ControlPanel() {
  return (
    (<Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">Control Panel</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="led-control" className="text-gray-600">LED Control</Label>
          <Switch id="led-control" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="buzzer-control" className="text-gray-600">Buzzer Control</Label>
          <Switch id="buzzer-control" />
        </div>
        <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
          Reset All Alarms
        </Button>
      </CardContent>
    </Card>)
  );
}

