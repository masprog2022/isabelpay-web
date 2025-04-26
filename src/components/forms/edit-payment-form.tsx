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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePayment } from "@/services/payment.service";
import getCookie from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schema de validação com Zod
const editPaymentFormSchema = z.object({
  monthlyFee: z
    .number({ invalid_type_error: "A mensalidade deve ser um número" })
    .min(0, "A mensalidade deve ser maior ou igual a 0"),
  paymentMethod: z.string().min(1, "O método de pagamento é obrigatório"),
});

// Tipo para os valores do formulário
type EditPaymentFormValues = z.infer<typeof editPaymentFormSchema>;

interface EditPaymentFormProps {
  paymentId: number;
  initialValues: {
    monthlyFee: number;
    paymentMethod: string;
  };
  setIsOpen: (open: boolean) => void;
}

export function EditPaymentForm({
  paymentId,
  initialValues,
  setIsOpen,
}: EditPaymentFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<EditPaymentFormValues>({
    resolver: zodResolver(editPaymentFormSchema),
    defaultValues: initialValues,
  });

  // Configuração do useMutation para atualizar pagamento
  const mutation = useMutation({
    mutationFn: async (data: EditPaymentFormValues) => {
      const token = getCookie("token") || "";
      return updatePayment(paymentId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Pagamento atualizado com sucesso!");
      form.reset();
      setIsOpen(false);
    },
    onError: (error: any) => {
      console.error("Erro completo:", error);
      if (error.response) {
        console.error("Resposta da API:", error.response.data);
        form.setError("root", {
          message:
            error.response.data.message || "Erro ao atualizar pagamento.",
        });
      } else {
        form.setError("root", {
          message: "Erro ao atualizar pagamento. Tente novamente.",
        });
      }
    },
  });

  const handleSubmit = (data: EditPaymentFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Campo Mensalidade */}
        <FormField
          control={form.control}
          name="monthlyFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensalidade</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: 7000"
                  type="number"
                  step="0.01"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.valueAsNumber;
                    field.onChange(isNaN(value) ? undefined : value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Método de Pagamento */}
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pagamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="TRANSFERÊNCIA">TRANSFERÊNCIA</SelectItem>
                  {/* Adicione outros métodos de pagamento aqui, se necessário */}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mensagem de erro geral */}
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
            onClick={() => setIsOpen(false)}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="text-sm"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
