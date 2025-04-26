"use client";

import { AppSidebar } from "@/components/features/app-sidebar";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getOverduePayments } from "@/services/payment.service";
import { OverduePayment } from "@/types/Overdue"; // Verifique o caminho
import getCookie from "@/utils/utils";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const queryClient = new QueryClient();

export default function OverduePaymentPage() {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined
  );
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    undefined
  );

  // Usando React Query para buscar dados
  const {
    data: overduePayments = [],
    isLoading,
    error,
  } = useQuery<OverduePayment[]>({
    queryKey: ["overduePayments", selectedYear, selectedMonth],
    queryFn: async () => {
      const token = getCookie("token") || "";
      const payments = await getOverduePayments(
        token,
        selectedYear,
        selectedMonth
      );

      return payments;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <div className="p-6 pb-0 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Devedores</h1>
              <p className="text-sm text-gray-600 mt-1">
                Lista de pagamentos atrasados das quotas de condóminio
              </p>
            </div>
          </div>
          <div className="p-6">
            <div className="rounded-md">
              {isLoading ? (
                <div>Carregando...</div>
              ) : error ? (
                <div>Erro ao carregar os dados: {error.message}</div>
              ) : (
                <DataTable
                  columns={columns}
                  data={overduePayments}
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
    </QueryClientProvider>
  );
}
