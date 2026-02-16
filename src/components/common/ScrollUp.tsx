"use client";

import { useEffect } from "react";

export function ScrollUp() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return null;
}
