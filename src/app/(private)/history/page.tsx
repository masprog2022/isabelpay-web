"use client";

import { AppSidebar } from "@/components/features/app-sidebar";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getResidentsPaymentStatus } from "@/services/dashboard.service";
import { PaymentStatus } from "@/types/PaymentStatus";
import getCookie from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function HistoryPaymentPage() {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );

  // Usando React Query para buscar dados
  const { data: paymentStatus = [], isLoading } = useQuery<PaymentStatus[]>({
    queryKey: ["residentsPaymentStatus", selectedYear],
    queryFn: async () => {
      const token = getCookie("token") || "";
      const residentsPaymentStatus = await getResidentsPaymentStatus(
        token,
        selectedYear
      );

      // Mapeia os dados para o formato esperado pela tabela
      return residentsPaymentStatus.map((resident) => ({
        morador: resident.name,
        janeiro: resident.paymentStatusByMonth.Janeiro,
        fevereiro: resident.paymentStatusByMonth.Fevereiro,
        marco: resident.paymentStatusByMonth.Março,
        abril: resident.paymentStatusByMonth.Abril,
        maio: resident.paymentStatusByMonth.Maio,
        junho: resident.paymentStatusByMonth.Junho,
        julho: resident.paymentStatusByMonth.Julho,
        agosto: resident.paymentStatusByMonth.Agosto,
        setembro: resident.paymentStatusByMonth.Setembro,
        Outubro: resident.paymentStatusByMonth.Outubro,
        novembro: resident.paymentStatusByMonth.Novembro,
        dezembro: resident.paymentStatusByMonth.Dezembro,
      }));
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
            <h1 className="text-2xl font-bold text-gray-900">
              Histórico de Pagamento
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Listar todo histórico de pagamento dos moradores.
            </p>
          </div>
        </div>
        <div className="p-6">
          <div className="rounded-md">
            {isLoading ? (
              <div>Carregando...</div>
            ) : (
              <DataTable
                columns={columns}
                data={paymentStatus}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
              />
            )}
          </div>
        </div>
        <Toaster richColors />
      </SidebarInset>
    </SidebarProvider>
  );
}
