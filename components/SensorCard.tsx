import { Card, CardContent } from "@/components/ui/card";

type SensorCardProps = {
  name: string;
  value: number | string;
  unit?: string;
  status?: "normal" | "warning" | "danger";
};

const statusColor = {
  normal: "text-green-600",
  warning: "text-yellow-600",
  danger: "text-red-600",
};

export function SensorCard({ name, value, unit, status = "normal" }: SensorCardProps) {
  return (
    <Card className="rounded-2xl shadow-md p-4">
      <CardContent>
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className={`text-3xl font-bold ${statusColor[status]}`}>
          {value} {unit}
        </p>
      </CardContent>
    </Card>
  );
}
