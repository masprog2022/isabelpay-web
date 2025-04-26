"use client";

import { loginAction } from "@/actions/auth.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const promise = loginAction(data).then((result) => {
        router.push("/");
        return result;
      });

      toast.promise(promise, {
        loading: "Autenticando...",
        success: (result) => {
          return `Login efectuado com sucesso!`;
        },
        error: () => {
          return "Erro ao fazer login, Credências inválidas.";
        },
      });
    } catch (error) {
      toast.error("Erro ao fazer login");
      console.error("Login error:", error);
    }
  };

  return {
    form,
    onSubmit,
  };
}
