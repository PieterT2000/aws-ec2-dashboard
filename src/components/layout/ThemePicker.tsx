"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemePicker() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
  ] as const;

  return (
    <div className="flex items-center bg-muted/50 rounded-full p-1 gap-x-2">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
            "hover:bg-muted/80 focus:outline-none",
            theme === value
              ? "bg-background shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={`Switch to ${label} theme`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
