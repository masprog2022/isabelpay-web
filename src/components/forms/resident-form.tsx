"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createResident } from "@/services/residents.service";
import getCookie from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const residentFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  otherName: z.string().optional(),
  houseNumber: z.string().min(1, "O número da casa é obrigatório"),
  contact: z
    .string()
    .min(9, "O contacto deve ter pelo menos 9 dígitos")
    .regex(/^\+?\d+$/, "O contacto deve conter apenas números"),
  email: z.string().email("Email inválido").min(1, "O email é obrigatório"),
  bi: z.string().min(1, "O BI é obrigatório"),
});

type ResidentFormValues = z.infer<typeof residentFormSchema>;

type ResidentSubmitValues = ResidentFormValues & {
  password: string;
  active: boolean;
  roles: string[];
};

interface ResidentFormProps {
  setIsOpen?: (open: boolean) => void;
}

export function ResidentForm({ setIsOpen }: ResidentFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<ResidentFormValues>({
    resolver: zodResolver(residentFormSchema),
    defaultValues: {
      name: "",
      otherName: "",
      houseNumber: "",
      contact: "",
      bi: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ResidentSubmitValues) => {
      const token = getCookie("token") || "";
      return createResident(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      toast.success("Morador registrado com sucesso!");
      form.reset();
      setIsOpen?.(false);
    },
    onError: (error: any) => {
      console.error("Erro ao criar morador:", error.message);
      if (error.message.includes("Número da casa já associado")) {
        form.setError("houseNumber", {
          message: "Este número da casa já está associado a um morador activo.",
        });
      } else {
        form.setError("root", {
          message: "Erro ao registrar morador. Tente novamente.",
        });
      }
    },
  });

  const handleSubmit = (data: ResidentFormValues) => {
    const submitData: ResidentSubmitValues = {
      ...data,
      password: "123456",
      active: true,
      roles: ["ROLE_RESIDENT"],
    };
    mutation.mutate(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Nome */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Morador</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Caríssimo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nome adicional (não obrigatório) */}
        <FormField
          control={form.control}
          name="otherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Familiar do Morador</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Mundombe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Número da casa */}
        <FormField
          control={form.control}
          name="houseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número da Casa</FormLabel>
              <FormControl>
                <Input placeholder="Ex: A0IV04" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contacto */}
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contacto</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 922300939" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* BI */}
        <FormField
          control={form.control}
          name="bi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bilhete de Identidade</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 003456789LA032" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: carissimo.mundombe@unitel.co.ao"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Erro geral */}
        {form.formState.errors.root && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.root.message}
          </p>
        )}

        {/* Botões */}
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            className="text-sm"
            onClick={() => setIsOpen?.(false)}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="text-sm"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Registrando..." : "Registrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
