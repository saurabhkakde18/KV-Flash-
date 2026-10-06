"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  asLink?: boolean;
}

export function BrandLogo({ size = "md", showTagline = true, className = "", asLink = true }: BrandLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg sm:text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  };

  const taglineSizes = {
    sm: "text-[9px]",
    md: "text-[10px] sm:text-[11px]",
    lg: "text-xs",
    xl: "text-sm"
  };

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dynamic Lightning Logo Icon */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-hover text-white shadow-soft shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/5 h-3/5 drop-shadow"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none" />
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="absolute -bottom-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${textSizes[size]} text-foreground`}>
            KV
          </span>
          <span className={`font-black tracking-tight ${textSizes[size]} text-accent`}>
            FLASH
          </span>
        </div>
        {showTagline && (
          <span className={`font-semibold text-accent/90 tracking-normal mt-0.5 whitespace-nowrap leading-tight ${taglineSizes[size]}`}>
            You&apos;re one step closer to what you want
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return <Link href="/" className="inline-block transition-opacity hover:opacity-90">{content}</Link>;
  }

  return content;
}
