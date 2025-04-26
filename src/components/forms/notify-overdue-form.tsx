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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { notifyOverduePayments } from "@/services/payment.service";
import getCookie from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const notifyFormSchema = z.object({
  year: z.string().optional(),
  month: z.string().optional(),
});

type NotifyFormValues = z.infer<typeof notifyFormSchema>;

interface NotifyOverdueFormProps {
  setIsOpen: (isOpen: boolean) => void;
}

export function NotifyOverdueForm({ setIsOpen }: NotifyOverdueFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NotifyFormValues>({
    resolver: zodResolver(notifyFormSchema),
    defaultValues: {
      year: undefined,
      month: undefined,
    },
  });

  // Gerar lista de anos (2020 até o ano atual)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2019 },
    (_, i) => currentYear - i
  );

  // Lista de meses (1 a 12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  async function onSubmit(values: NotifyFormValues) {
    setIsLoading(true);
    try {
      const token = getCookie("token") || "";
      const year =
        values.year && values.year !== "all"
          ? parseInt(values.year)
          : undefined;
      const month =
        values.month && values.month !== "all"
          ? parseInt(values.month)
          : undefined;

      const response = await notifyOverduePayments(token, year, month);
      toast.success(response); // Exibe "Notificações enviadas com sucesso."
      setIsOpen(false); // Fecha o modal
    } catch (error) {
      toast.error("Erro ao enviar notificações: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mês</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">Todos os meses</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {new Date(0, month - 1).toLocaleString("pt-BR", {
                        month: "long",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Notificar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
