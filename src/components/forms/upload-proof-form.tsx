"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadProof } from "@/services/payment.service";
import getCookie from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface UploadProofFormProps {
  paymentId: number;
  setIsOpen: (open: boolean) => void;
  onProofUploaded: () => void;
}

export function UploadProofForm({
  paymentId,
  setIsOpen,
  onProofUploaded,
}: UploadProofFormProps) {
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error("Nenhum arquivo selecionado");
      }
      const token = getCookie("token") || "";
      return uploadProof(paymentId, file, token);
    },
    onSuccess: () => {
      toast.success("Comprovativo anexado com sucesso!");
      onProofUploaded();
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao anexar comprovativo");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Por favor, selecione um arquivo");
      return;
    }
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Selecione o comprovativo
        </label>
        <Input
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="mt-1"
        />
      </div>
      {mutation.isError && (
        <p className="text-red-600 text-sm">
          {mutation.error?.message || "Erro ao anexar comprovativo"}
        </p>
      )}
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={mutation.isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </form>
  );
}
