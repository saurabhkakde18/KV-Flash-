"use client";

import React, { useState } from "react";
import { useTheme, THEMES_LIST } from "@/context/ThemeContext";
import { ThemeType } from "@/types";
import { Check, Palette, Sparkles, Crown } from "lucide-react";

interface ThemeSelectorProps {
  onClose?: () => void;
}

export function ThemeSelector({ onClose }: ThemeSelectorProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [previewTheme, setPreviewTheme] = useState<ThemeType>(theme);

  const handleApply = (id: ThemeType) => {
    setTheme(id);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-foreground text-base tracking-tight flex items-center gap-1.5">
              Select Luxury Theme
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                Executive
              </span>
            </h3>
            <p className="text-xs text-muted">Curated high-contrast luxury fintech color schemes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
        {THEMES_LIST.map((t) => {
          const isSelected = theme === t.id;

          return (
            <button
              key={t.id}
              onClick={() => handleApply(t.id)}
              onMouseEnter={() => setPreviewTheme(t.id)}
              className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between min-h-[110px] group ${
                isSelected
                  ? "border-accent ring-2 ring-accent/40 shadow-lg shadow-accent/15"
                  : "border-border/80 hover:border-accent/60 bg-surface/50 hover:bg-surface"
              }`}
              style={{
                backgroundColor: t.id === "auto" ? undefined : t.cardHex,
              }}
            >
              {/* Header with Name & Check */}
              <div className="flex items-center justify-between w-full z-10 mb-1">
                <span
                  className="font-black text-sm tracking-tight"
                  style={{ color: t.id === "auto" ? "var(--text-primary)" : t.textHex }}
                >
                  {t.name}
                </span>
                {isSelected && (
                  <span
                    className="p-1 rounded-full flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: t.accentHex }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>

              {/* Description */}
              <p
                className="text-[11px] line-clamp-2 z-10 opacity-85 font-medium mb-2"
                style={{ color: t.id === "auto" ? "var(--text-secondary)" : t.textHex }}
              >
                {t.description}
              </p>

              {/* Color Swatch Dots */}
              <div className="flex items-center gap-1.5 z-10 pt-1 border-t border-white/10">
                <span
                  className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                  style={{ backgroundColor: t.bgHex }}
                  title="Background"
                />
                <span
                  className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                  style={{ backgroundColor: t.cardHex }}
                  title="Card Surface"
                />
                <span
                  className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                  style={{ backgroundColor: t.accentHex }}
                  title="Primary Accent"
                />
                <span
                  className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                  style={{ backgroundColor: t.textHex }}
                  title="Text"
                />
              </div>

              {/* Subtle accent glow in background */}
              <div
                className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20 blur-xl pointer-events-none group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: t.accentHex }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
