"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { createPayment } from "@/services/payment.service";
import { PaymentSubmitValues } from "@/types/Payment";
import getCookie from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schema de validação com Zod
const paymentFormSchema = z.object({
  residentId: z
    .number({ invalid_type_error: "O ID do morador deve ser um número" })
    .min(0, "O ID do morador é obrigatório"),
  year: z
    .number({ invalid_type_error: "O ano deve ser um número" })
    .min(2000, "O ano deve ser maior ou igual a 2000"),
  months: z.array(z.string()).min(1, "Selecione pelo menos um mês"), // Alterar month para months como array
  monthlyFee: z
    .number({ invalid_type_error: "A mensalidade deve ser um número" })
    .min(0, "A mensalidade deve ser maior ou igual a 0"),
  paymentMethod: z.string().min(1, "O método de pagamento é obrigatório"),
});

// Tipo para os valores do formulário
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  setIsOpen?: (open: boolean) => void;
  residentId?: number;
}

export function PaymentDebtsForm({ setIsOpen, residentId }: PaymentFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      residentId: residentId ?? undefined,
      year: undefined,
      months: [], // Alterar para array vazio
      monthlyFee: undefined,
      paymentMethod: "",
    },
  });

  // Configuração do useMutation para criar pagamento
  const mutation = useMutation({
    mutationFn: async (data: PaymentSubmitValues) => {
      const token = getCookie("token") || "";
      return createPayment(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Pagamento registrado com sucesso!");
      form.reset();
      setIsOpen?.(false);
    },
    onError: (error: any) => {
      console.error("Erro completo:", error);
      if (error.response) {
        console.error("Resposta da API:", error.response.data);
        form.setError("root", {
          message:
            error.response.data.message || "Erro ao registrar pagamento.",
        });
      } else {
        form.setError("root", {
          message: "Erro ao registrar pagamento. Tente novamente.",
        });
      }
    },
  });

  const handleSubmit = (data: PaymentFormValues) => {
    const submitData: PaymentSubmitValues = {
      residentId: data.residentId,
      paidMonths: data.months.map((month) => ({ year: data.year, month })), // Mapear meses para o formato esperado
      monthlyFee: data.monthlyFee,
      paymentMethod: data.paymentMethod,
    };
    mutation.mutate(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Campo Resident ID */}
        <FormField
          control={form.control}
          name="residentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID do Morador</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: 1"
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.valueAsNumber;
                    field.onChange(isNaN(value) ? undefined : value);
                  }}
                  readOnly={!!residentId}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Ano */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: 2025"
                  type="number"
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

        {/* Campo Meses (múltiplos) */}
        <FormField
          control={form.control}
          name="months"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meses</FormLabel>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {field.value.length > 0
                      ? field.value
                          .map(
                            (month) =>
                              month.charAt(0) + month.slice(1).toLowerCase()
                          )
                          .join(", ")
                      : "Selecione os meses"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {[
                    "JANUARY",
                    "FEBRUARY",
                    "MARCH",
                    "APRIL",
                    "MAY",
                    "JUNE",
                    "JULY",
                    "AUGUST",
                    "SEPTEMBER",
                    "OCTOBER",
                    "NOVEMBER",
                    "DECEMBER",
                  ].map((month) => (
                    <DropdownMenuCheckboxItem
                      key={month}
                      checked={field.value.includes(month)}
                      onCheckedChange={(checked) => {
                        const newValue = checked
                          ? [...field.value, month]
                          : field.value.filter((m) => m !== month);
                        field.onChange(newValue);
                      }}
                    >
                      {month.charAt(0) + month.slice(1).toLowerCase()}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo Mensalidade */}
        <FormField
          control={form.control}
          name="monthlyFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensalidade</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: 8000"
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
