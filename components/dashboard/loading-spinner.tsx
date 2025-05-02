import { cn } from "@/lib/utils"; // Optional className helper
import { useEffect, useState } from "react";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg" | "xl"; // Added extra large size
  fullScreen?: boolean;
  className?: string;
  overlay?: boolean; // New prop to control overlay visibility
  id?: string; // New prop for identifying specific spinners
  delay?: number; // Add delay before showing (ms)
  minDuration?: number; // Minimum show duration (ms)
};

export function LoadingSpinner({
  size = "md",
  fullScreen = false,
  className,
  overlay = true,
  id,
  delay = 100, // Only show if loading takes more than 100ms
  minDuration = 500, // Show for at least 500ms
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-[6px]", // Added extra large size
  };

  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    let durationTimer: NodeJS.Timeout;

    delayTimer = setTimeout(() => {
      setShow(true);
      setMounted(true);
      durationTimer = setTimeout(() => setMounted(false), minDuration);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(durationTimer);
    };
  }, [delay, minDuration]);

  if (!show) return null;

  return (
    <div
      id={id}
      className={cn(
        "flex items-center justify-center",
        fullScreen ? "fixed inset-0 z-50" : "",
        overlay ? "bg-background/80" : "",
        className
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className={cn(
          "inline-block animate-spin rounded-full border-solid border-primary border-t-transparent",
          sizeClasses[size],
          // Smooth transition for appearance/disappearance
          "transition-opacity duration-300 ease-in-out"
        )}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
