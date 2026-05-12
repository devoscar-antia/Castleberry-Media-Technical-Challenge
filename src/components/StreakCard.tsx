import { useState, useEffect } from "react";
import { Flame, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
}

export function StreakCard({ currentStreak, longestStreak, className }: StreakCardProps) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const weekLabels = ["W1", "W2", "W3", "W4"];
  const streakWeeks = Array(4).fill(0).map((_, i) => i < Math.min(currentStreak, 4));

  return (
    <Card className={cn("overflow-hidden mb-6", className)}>
      <CardContent className="p-5 relative overflow-hidden">
        {/* background “flames” */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-violet-500/10 rounded-full blur-xl dark:bg-violet-600/10" />
        <div className="absolute -left-10 -bottom-10 w-28 h-28 bg-violet-500/10 rounded-full blur-xl dark:bg-violet-600/10" />

        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h2 className="font-semibold">Your Streak</h2>
            <p className="text-sm text-muted-foreground">Keep it going!</p>
          </div>
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br text-white",
              "from-violet-400 to-violet-500",
              animate ? "animate-pulse-light shadow-lg shadow-violet-500/20" : ""
            )}
          >
            <Flame className="h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="text-3xl font-bold">{currentStreak}</div>
          <div className="text-sm text-muted-foreground flex flex-col">
            <span>weeks</span>
            <span>current</span>
          </div>
          <div className="mx-2 h-10 w-px bg-border"></div>
          <div className="text-xl font-semibold text-muted-foreground">
            {longestStreak}
          </div>
          <div className="text-sm text-muted-foreground flex flex-col">
            <span>weeks</span>
            <span>best</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {weekLabels.map((week, i) => (
            <div key={i} className="text-xs text-center text-muted-foreground mb-1">
              {week}
            </div>
          ))}
          {streakWeeks.map((active, i) => (
            <div
              key={i}
              className={cn(
                "aspect-square rounded-md flex items-center justify-center text-xs border transition-all",
                active
                  ? "bg-gradient-to-br from-violet-400 to-violet-500 border-violet-400 text-white"
                  : "bg-secondary/50 border-border"
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
