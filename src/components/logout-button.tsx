// src/components/logout-button.tsx
"use client";

import { logoutAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Primeiro mostra o toast
      toast.success("Logout realizado com sucesso");

      // Depois executa o logout
      await logoutAction();

      // Redireciona após um pequeno delay para o toast ser visível
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (error) {
      toast.error("Erro ao fazer logout");
      console.error("Logout error:", error);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} className={className}>
      Sair
    </Button>
  );
}
