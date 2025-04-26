"use client";

import { PaymentDebtsForm } from "@/components/forms/paymemt-debts-form";
import { OverdueDetailsModal } from "@/components/modal/overdue-details";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { notifyResident } from "@/services/payment.service";
import { OverdueMonth, OverduePayment } from "@/types/Overdue";
import getCookie from "@/utils/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Bell, CirclePlus, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<OverduePayment>[] = [
  {
    accessorKey: "residentId",
    header: "ID do morador",
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
    accessorKey: "residentBi",
    header: "BI do morador",
  },
  {
    accessorKey: "totalDebt",
    header: () => <div className="text-right">Total da dívida</div>,
    cell: ({ row }) => {
      const totalDebt = parseFloat(row.getValue("totalDebt"));
      const formatted = new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA",
      }).format(totalDebt);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Estado do Pagamento",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      const statusColors: Record<string, string> = {
        "Não Pago": "bg-red-500 text-white", // vermelho para atraso
      };
      return (
        <span
          className={`px-2 py-1 rounded-md text-sm font-medium ${
            statusColors[status] || "bg-gray-500 text-white"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "overdueMonths",
    header: "Meses em atraso",
    cell: ({ row }) => {
      const overdueMonths: OverdueMonth[] = row.getValue("overdueMonths");
      return <div>{overdueMonths.length}</div>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const overduePayment = row.original;
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isOpen, setIsOpen] = useState(false);
      const [isNotifying, setIsNotifying] = useState(false);

      const handleNotify = async () => {
        setIsNotifying(true);
        try {
          const token = getCookie("token") || "";
          const response = await notifyResident(
            token,
            overduePayment.residentId
          );
          toast.success(response); // Exibe "Notificações enviadas com sucesso."
        } catch (error) {
          toast.error(
            "Erro ao enviar notificação: " + (error as Error).message
          );
        } finally {
          setIsNotifying(false);
        }
      };

      return (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            title="Ver detalhes do devedor"
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </Button>
          <OverdueDetailsModal
            residentId={overduePayment.residentId}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          <Button
            variant="ghost"
            size="icon"
            title="Notificar devedor"
            onClick={handleNotify}
            disabled={isNotifying}
          >
            <Bell className="h-4 w-4 text-gray-600" />
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" title="Liquidar divida">
                <CirclePlus className="h-4 w-4 text-gray-600" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registar pagamento</DialogTitle>
              </DialogHeader>
              <PaymentDebtsForm
                setIsOpen={setIsOpen}
                residentId={overduePayment.residentId}
              />
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
