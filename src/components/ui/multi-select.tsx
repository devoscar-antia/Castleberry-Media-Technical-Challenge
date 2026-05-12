
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ReactNode } from "react";

interface MultiSelectProps {
  options: string[];
  selected: string[] | undefined | null;
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  leftIcon?: ReactNode;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
  className,
  leftIcon,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  // Ensure we always have valid arrays to work with
  const safeSelected = Array.isArray(selected) ? [...selected] : [];
  const safeOptions  = Array.isArray(options)  ? [...options]  : [];

  const handleSelect = (option: string) => {
    const newSelection = safeSelected.includes(option)
      ? safeSelected.filter((item) => item !== option)
      : [...safeSelected, option];
    onChange(newSelection);
  };

  const handleRemove = (option: string) => {
    onChange(safeSelected.filter((item) => item !== option));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between max-h-24 overflow-hidden", className)}
        >
          <div className="flex gap-1 flex-wrap w-full justify-start h-full overflow-y-auto"
            style={{ alignContent: "flex-start" }}>
            {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
            {safeSelected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              safeSelected.map(option => (
                <Badge key={option} variant="secondary" className="mr-1 mb-1">
                  {option}
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(option);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full bg-white dark:bg-slate-900 shadow-lg border rounded-md p-1 z-50"
        align="start"
        sideOffset={5}
        style={{ pointerEvents: 'auto' }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div
          className="max-h-60 overflow-y-auto overscroll-contain"
          onWheel={(e) => {
            e.stopPropagation();
            e.currentTarget.scrollTop += e.deltaY;
          }}
          onTouchMove={(e) => e.stopPropagation()}
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {safeOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No options available
            </div>
          ) : (
            safeOptions.map(option => {
              const isSelected = safeSelected.includes(option);
              return (
                <div
                  key={option}
                  className={cn(
                    "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm",
                    isSelected ? "bg-accent/50" : "",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{option}</span>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
