"use client";
import { useEffect, useState } from "react";

export function useRequireAuth() {
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json() as Promise<{ authenticated: boolean; username?: string }>)
      .then((data) => {
        if (!data.authenticated) {
          window.location.href = "/admin/login";
          return;
        }
        setUsername(data.username || "Admin");
        setReady(true);
      })
      .catch(() => {
        window.location.href = "/admin/login";
      });
  }, []);

  return { ready, username };
}
