
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface PointsBadgeProps {
  points: number;
}

export function PointsBadge({ points }: PointsBadgeProps) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, [points]);

  return (
    <Badge 
      className={`bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold py-1 px-3 gap-1 
                ${animate ? 'animate-scale shadow-lg' : 'shadow-md'}`}
    >
      <Trophy className="h-3.5 w-3.5" />
      <span>{points}</span>
    </Badge>
  );
}
