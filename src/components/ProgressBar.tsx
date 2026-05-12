
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  value: number;
  total: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({ value, total, label, size = "md" }: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / total) * 100), 100);
  
  const heightClass = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  }[size];
  
  return (
    <div className="w-full space-y-1">
      {label && (
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{label}</span>
          <span className="font-medium">{percentage}%</span>
        </div>
      )}
      <Progress 
        value={percentage} 
        className={`${heightClass} bg-secondary`} 
      />
    </div>
  );
}
