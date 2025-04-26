"use client";

import { EditPaymentForm } from "@/components/forms/edit-payment-form";
import { PaymentDetailsModal } from "@/components/modal/payment-details";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadProof } from "@/services/payment.service";
import { Payment } from "@/types/Payment";
import getCookie from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle, Edit, Eye, Paperclip } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "residentName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome do morador
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "bi",
    header: "Bilhete de Identidade",
  },
  {
    accessorKey: "monthlyFee",
    header: () => <div className="text-right">Valor da quota</div>,
    cell: ({ row }) => {
      const monthlyFee = parseFloat(row.getValue("monthlyFee"));
      const formatted = new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA",
      }).format(monthlyFee);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Total pago</div>,
    cell: ({ row }) => {
      const totalAmount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA",
      }).format(totalAmount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "statusPayment",
    header: "Estado do Pagamento",
    cell: ({ row }) => {
      const statusPayment: string = row.getValue("statusPayment");
      const statusColors: Record<string, string> = {
        PENDENTE: "bg-yellow-500 text-white",
        PAGO: "bg-green-500 text-white",
      };
      return (
        <span
          className={`px-2 py-1 rounded-md text-sm font-medium ${
            statusColors[statusPayment] || "bg-gray-500 text-white"
          }`}
        >
          {statusPayment}
        </span>
      );
    },
    filterFn: "equals",
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de Pagamento",
  },
  {
    accessorKey: "paymentDate",
    header: "Data de Criação",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const payment = row.original;
      const queryClient = useQueryClient();
      const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const fileInputRef = useRef<HTMLInputElement>(null);

      // Calcular se o pagamento tem mais de 30 dias
      const paymentDate = payment.paymentDate
        ? new Date(
            payment.paymentDate.split(" ")[0].split("/").reverse().join("-")
          )
        : null;
      const currentDate = new Date();
      const diffInDays = paymentDate
        ? (currentDate.getTime() - paymentDate.getTime()) /
          (1000 * 60 * 60 * 24)
        : Infinity;
      const isEditable = diffInDays <= 30;

      // Configuração do useMutation para upload do comprovativo
      const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
          const token = getCookie("token") || "";
          return uploadProof(payment.id, file, token);
        },
        onSuccess: (updatedPayment: Payment) => {
          toast.success("Comprovativo anexado com sucesso!");
          // Atualizar o cache do react-query com o pagamento retornado
          queryClient.setQueryData<Payment[]>(["payments"], (oldData) => {
            if (!oldData) return oldData;
            return oldData.map((p) =>
              p.id === payment.id ? updatedPayment : p
            );
          });
          queryClient.setQueryData<Payment>(
            ["payment", payment.id],
            updatedPayment
          );
          queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        onError: (error: any) => {
          toast.error("Erro ao anexar comprovativo. Tente novamente.");
          console.error("Erro ao anexar comprovativo:", error);
        },
      });

      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          uploadMutation.mutate(file);
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };

      const handlePaperclipClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      };

      // Log para depuração
      console.log("payment.hasProof:", payment.hasProof);

      return (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
            disabled={!isEditable}
            title={
              !isEditable
                ? "Não é possível editar pagamentos com mais de 30 dias"
                : "Editar pagamento"
            }
          >
            <Edit
              className={`h-4 w-4 ${
                isEditable ? "text-gray-600" : "text-gray-400"
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailsModalOpen(true);
            }}
            title="Ver detalhes do pagamento"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
          <PaymentDetailsModal
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            id={payment.id}
          />
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Pagamento #{payment.id}</DialogTitle>
              </DialogHeader>
              <EditPaymentForm
                paymentId={payment.id}
                initialValues={{
                  monthlyFee: payment.monthlyFee,
                  paymentMethod: payment.paymentMethod,
                }}
                setIsOpen={setIsEditModalOpen}
              />
            </DialogContent>
          </Dialog>
          <div className="flex items-center">
            <span
              title={
                payment.hasProof
                  ? "Comprovativo já anexado"
                  : "Anexar comprovativo"
              }
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaperclipClick();
                }}
                disabled={uploadMutation.isPending || payment.hasProof}
              >
                <Paperclip
                  className={`h-4 w-4 ${
                    uploadMutation.isPending || payment.hasProof
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                />
              </Button>
            </span>
            {payment.hasProof && (
              <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
            />
          </div>
        </div>
      );
    },
  },
];
