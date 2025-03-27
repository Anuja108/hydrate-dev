"use client";

import { useEffect, useState } from "react";

interface WaterLevelProps {
  level: number;
  maxLevel: number;
}

export default function WaterLevel({ level, maxLevel }: WaterLevelProps) {
  const [animatedLevel, setAnimatedLevel] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLevel(level);
    }, 100);
    return () => clearTimeout(timer);
  }, [level]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const percentage = (animatedLevel / maxLevel) * 100;

  return (
    <div
      className={`relative border-2 border-border rounded-lg overflow-hidden bg-background ${
        isMobile ? "w-full h-16" : "w-full h-64"
      }`}
    >
      <div
        className={`bg-muted transition-all duration-1000 ease-out ${
          isMobile
            ? "absolute top-0 left-0 bottom-0"
            : "absolute bottom-0 left-0 right-0"
        }`}
        style={
          isMobile ? { width: `${percentage}%` } : { height: `${percentage}%` }
        }
      >
        {isMobile ? (
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-muted-foreground/20"></div>
        ) : (
          <div className="absolute top-0 left-0 right-0 h-2 bg-muted-foreground/20"></div>
        )}
      </div>

      {Array.from({ length: maxLevel }).map((_, index) => {
        const pos = (index / maxLevel) * 100;
        return isMobile ? (
          <div
            key={index}
            className="absolute top-0 bottom-0 border-l border-dashed border-muted-foreground/20"
            style={{
              left: `${pos}%`,
              opacity: index < animatedLevel ? 0 : 0.5,
            }}
          />
        ) : (
          <div
            key={index}
            className="absolute left-0 right-0 border-t border-dashed border-muted-foreground/20"
            style={{
              bottom: `${pos}%`,
              opacity: index < animatedLevel ? 0 : 0.5,
            }}
          />
        );
      })}
    </div>
  );
}
