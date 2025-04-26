"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPayment, getResidents } from "@/services/payment.service";
import { PaymentSubmitValues } from "@/types/Payment";
import getCookie from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Schema de validação com Zod
const paymentFormSchema = z.object({
  residentId: z
    .number({ invalid_type_error: "Selecione um morador" })
    .min(0, "O morador é obrigatório"),
  year: z
    .number({ invalid_type_error: "O ano deve ser um número" })
    .min(2000, "O ano deve ser maior ou igual a 2000"),
  months: z.array(z.string()).min(1, "Selecione pelo menos um mês"),
  monthlyFee: z
    .number({ invalid_type_error: "A mensalidade deve ser um número" })
    .min(0, "A mensalidade deve ser maior ou igual a 0"),
  paymentMethod: z.string().min(1, "O método de pagamento é obrigatório"),
});

// Tipo para os valores do formulário
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  setIsOpen?: (open: boolean) => void;
}

export function PaymentForm({ setIsOpen }: PaymentFormProps) {
  const queryClient = useQueryClient();
  const token = getCookie("token") || "";

  // Buscar a lista de moradores com useQuery
  const { data: residents = [], isLoading: isLoadingResidents } = useQuery({
    queryKey: ["residents"],
    queryFn: () => getResidents(token),
    staleTime: 1000 * 60 * 60, // 1 hora
    // cacheTime: 1000 * 60 * 60, // 1 hora
  });

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      residentId: undefined,
      year: undefined,
      months: [],
      monthlyFee: undefined,
      paymentMethod: "",
    },
  });

  // Configuração do useMutation para criar pagamento
  const mutation = useMutation({
    mutationFn: async (data: PaymentSubmitValues) => {
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
      paidMonths: data.months.map((month) => ({ year: data.year, month })),
      monthlyFee: data.monthlyFee,
      paymentMethod: data.paymentMethod,
    };
    mutation.mutate(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Campo Morador (Combobox com busca) */}
        <FormField
          control={form.control}
          name="residentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Morador</FormLabel>
              <FormControl>
                <Combobox
                  residents={residents}
                  isLoading={isLoadingResidents}
                  disabled={isLoadingResidents || mutation.isPending}
                  value={field.value}
                  onChange={field.onChange}
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

// Componente personalizado Combobox para busca de moradores
interface ComboboxProps {
  residents: { id: number; name: string }[];
  isLoading: boolean;
  disabled: boolean;
  value?: number;
  onChange: (value?: number) => void;
}

function Combobox({
  residents,
  isLoading,
  disabled,
  value,
  onChange,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedResident = residents.find((resident) => resident.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedResident ? selectedResident.name : "Selecione um morador"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar morador..." />
          <CommandList>
            <CommandEmpty>
              {isLoading
                ? "Carregando moradores..."
                : "Nenhum morador encontrado"}
            </CommandEmpty>
            <CommandGroup>
              {residents.map((resident) => (
                <CommandItem
                  key={resident.id}
                  value={resident.name}
                  onSelect={() => {
                    onChange(resident.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      resident.id === value ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {resident.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
