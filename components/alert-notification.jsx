import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function AlertNotification({ gasAlert, fireAlert }) {
  // Determine if there are any active alerts
  const showAlert = gasAlert || fireAlert;
  let alertMessage = gasAlert
    ? "Gas Leak Detected!"
    : fireAlert
    ? "Fire Detected!"
    : "";

  if (!showAlert) return null;

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
