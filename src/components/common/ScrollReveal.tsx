"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  scale?: number;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 1000,
  scale = 1,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getDirectionClass = () => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return "translate-y-12";
        case "down":
          return "-translate-y-12";
        case "left":
          return "translate-x-12";
        case "right":
          return "-translate-x-12";
        default:
          return "";
      }
    }
    return "translate-x-0 translate-y-0";
  };

  const getScaleClass = () => {
    return !isVisible ? `scale-[${scale}]` : "scale-100";
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: !isVisible
          ? `${direction === "up" ? "translateY(30px)" : direction === "down" ? "translateY(-30px)" : direction === "left" ? "translateX(30px)" : direction === "right" ? "translateX(-30px)" : ""} scale(${scale})`
          : "translate(0) scale(1)",
      }}
      className={`transition-all cubic-bezier(0.16, 1, 0.3, 1) ${className}`}
    >
      {children}
    </div>
  );
}
