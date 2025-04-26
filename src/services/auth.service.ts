// src/services/auth.service.ts
interface LoginResponse {
  name: string;
  email: string;
  token: string;
}

export const AuthService = {
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await fetch("http://localhost:8083/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Credenciais inválidas");
        }
        throw new Error("Erro ao fazer login");
      }

      return await response.json();
    } catch (error) {
      console.error("AuthService.login error:", error);
      throw error;
    }
  },
  // ... (outros métodos)
};
