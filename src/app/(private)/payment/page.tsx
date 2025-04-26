"use client";

import { AppSidebar } from "@/components/features/app-sidebar";
import { PaymentForm } from "@/components/forms/paymemt-form";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getPayments } from "@/services/payment.service";
import { Payment } from "@/types/Payment";
import getCookie from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function PaymentPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    undefined
  );

  //Usando React Query para buscar dados
  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ["payments", selectedYear, selectedMonth],
    queryFn: async () => {
      const token = getCookie("token") || "";
      return getPayments(token, selectedYear, selectedMonth);
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="p-6 pb-0 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pagamento</h1>
            <p className="text-sm text-gray-600 mt-1">
              Lista de pagamento das quotas de condóminio
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2 cursor-pointer">
                <Plus className="h-4 w-4" />
                <span>Registar pagamento</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registar pagamento</DialogTitle>
              </DialogHeader>
              <PaymentForm setIsOpen={setIsOpen} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="p-6">
          <div className="rounded-md">
            {isLoading ? (
              <div>Carregando...</div>
            ) : (
              <DataTable
                columns={columns}
                data={payments}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
              />
            )}
          </div>
        </div>
        <Toaster richColors />
      </SidebarInset>
    </SidebarProvider>
  );
}
