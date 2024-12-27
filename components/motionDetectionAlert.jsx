import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function MotionDetectionAlert({ alertMessage}) {
  // Determine if there are any active alerts
  


  return (
    <Alert
      variant="destructive"
      className="bg-red-50 border-red-200 text-red-800"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Alert</AlertTitle>
      <AlertDescription>{alertMessage}</AlertDescription>
    </Alert>
  );
}
