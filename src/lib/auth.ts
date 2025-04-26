// src/lib/auth.ts
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface JwtPayload {
  sub: string; // email
  roles?: string[];
  exp: number;
}

interface UserData {
  email: string;
  name: string;
  roles?: string[];
}

export function getCurrentUser(): UserData | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    const userName = cookieStore.get("userName")?.value;

    if (!token || !userName) {
      console.log("Token or userName cookie missing");
      return null;
    }

    const decoded = jwtDecode<JwtPayload>(token);

    return {
      email: decoded.sub,
      name: userName,
      roles: decoded.roles,
    };
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}
