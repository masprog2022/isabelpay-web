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
import { Textarea } from "@/components/ui/textarea";
import { inactivateResident } from "@/services/residents.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  id: z.number(),
  active: z.boolean(),
  reasonForInactivation: z
    .string()
    .min(1, "O motivo da inativação é obrigatório"),
});

interface InactivateResidentFormProps {
  residentId: number;
  residentName: string;
  token: string;
  onClose: () => void;
}

export function InactivateResidentForm({
  residentId,
  residentName,
  token,
  onClose,
}: InactivateResidentFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: residentId,
      active: false,
      reasonForInactivation: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      inactivateResident(token, {
        id: data.id,
        active: data.active,
        reasonForInactivation: data.reasonForInactivation,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      toast.success(`Morador ${residentName} inativado com sucesso!`);
      onClose();
    },
    onError: (error: Error) => {
      toast.error(`Falha ao inativar morador: ${error.message}`);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="reasonForInactivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo da Inativação</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Digite o motivo da inativação (ex.: Vendeu a residência para outra pessoa)"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Inativando..." : "Confirmar Inativação"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
