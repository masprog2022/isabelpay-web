"use server";

import { AuthService } from "@/services/auth.service";
import { cookies } from "next/headers";

export async function loginAction(credentials: {
  email: string;
  password: string;
}) {
  try {
    const result = await AuthService.login(credentials);

    (await cookies()).set("token", result.token, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    (await cookies()).set("userName", result.name, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return result;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

export async function logoutAction() {
  (await cookies()).delete("token");
  (await cookies()).delete("userName");
}

export async function getTokenAction() {
  return (await cookies()).get("token")?.value;
}
