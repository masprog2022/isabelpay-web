// src/components/user-info.tsx
"use client";

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

interface UserData {
  email: string;
}

interface JwtPayload {
  sub: string; // email
  roles?: string[];
  exp: number;
}

export function UserInfo() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const getToken = () => {
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
    };

    const token = getToken();

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (decoded.sub) {
          setUser({
            email: decoded.sub,
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  if (!user) return null;

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Informações do Usuário</h2>
      <p className="text-base font-sans">
        <span className="font-medium">Email:</span> {user.email}
      </p>
    </div>
  );
}
