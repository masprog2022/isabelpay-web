"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getOverduePaymentByResidentId } from "@/services/payment.service";
import { OverduePayment } from "@/types/Overdue";
import getCookie from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useState } from "react";

interface OverdueDetailsModalProps {
  residentId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function OverdueDetailsModal({
  residentId,
  isOpen,
  onClose,
}: OverdueDetailsModalProps) {
  const {
    data: overduePayment,
    isLoading,
    isError,
  } = useQuery<OverduePayment>({
    queryKey: ["overduePayment", residentId],
    queryFn: async () => {
      const token = getCookie("token") || "";
      return getOverduePaymentByResidentId(residentId, token);
    },
    enabled: isOpen, // Só busca os dados quando o modal está aberto
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const [showAllYears, setShowAllYears] = useState(false);

  if (!isOpen) return null;

  const statusColors: Record<string, string> = {
    "Não Pago": "bg-red-600 text-white",
  };

  // Agrupar meses por ano e calcular o monthlyFee total por ano
  const groupedMonthsByYear: {
    [year: string]: { months: string[]; monthlyFee: number; totalFee: number };
  } = {};
  if (overduePayment?.overdueMonths) {
    overduePayment.overdueMonths.forEach((month) => {
      const year = month.year.toString();
      if (!groupedMonthsByYear[year]) {
        groupedMonthsByYear[year] = {
          months: [],
          monthlyFee: month.monthlyFee,
          totalFee: 0,
        };
      }
      groupedMonthsByYear[year].months.push(
        month.month.substring(0, 3).toUpperCase()
      );
      groupedMonthsByYear[year].totalFee += month.monthlyFee;
    });
  }

  const years = Object.keys(groupedMonthsByYear).sort(
    (a, b) => parseInt(b) - parseInt(a)
  ); // Ordenar anos decrescente
  const initialYearsLimit = 3; // Limite inicial de anos a exibir
  const displayedYears = showAllYears
    ? years
    : years.slice(0, initialYearsLimit);
  const hasMoreYears = years.length > initialYearsLimit;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl dark:bg-neutral-950 dark:text-white">
        <DialogHeader>
          <DialogTitle>Detalhes da Dívida #{residentId}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : isError || !overduePayment ? (
          <div className="py-4 text-red-500">
            Não foi possível carregar os detalhes da dívida.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Informações do Morador */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mt-8">
                Informações do Morador
              </h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong className="font-medium">Nome:</strong>{" "}
                  {overduePayment.residentName}
                </p>
                <p className="text-sm">
                  <strong className="font-medium">Email:</strong>{" "}
                  {overduePayment.residentEmail}
                </p>

                <p className="text-sm">
                  <strong className="font-medium">Contacto:</strong>{" "}
                  {overduePayment.residentPhone}
                </p>
                <p className="text-sm">
                  <strong className="font-medium">BI:</strong>{" "}
                  {overduePayment.residentBi}
                </p>
              </div>
            </div>

            {/* Meses em Atraso */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Meses em Atraso</h3>
              {overduePayment.overdueMonths?.length > 0 ? (
                <div>
                  <ul className="space-y-2">
                    {displayedYears.map((year) => (
                      <li key={year} className="text-sm">
                        <p>
                          <strong className="font-medium">Ano: {year}:</strong>{" "}
                          [{groupedMonthsByYear[year].months.join(", ")}] -{" "}
                          {groupedMonthsByYear[year].totalFee.toFixed(2)} AOA
                        </p>
                      </li>
                    ))}
                  </ul>
                  {hasMoreYears && (
                    <Button
                      variant="link"
                      className="mt-2 text-blue-400 hover:text-blue-600"
                      onClick={() => setShowAllYears(!showAllYears)}
                    >
                      {showAllYears ? (
                        <>
                          Ver menos <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Ver mais ({years.length - initialYearsLimit} anos){" "}
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-300">
                  Nenhum mês em atraso encontrado.
                </p>
              )}
            </div>

            {/* Status e Total */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status e Total</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong className="font-medium">Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      statusColors[overduePayment.status] || "bg-gray-600"
                    }`}
                  >
                    {overduePayment.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Total da Dívida */}
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold">Total da Dívida</h3>
              <p className="text-xl font-bold">
                {overduePayment.totalDebt.toFixed(2)} AOA
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button
            onClick={onClose}
            className="bg-main hover:bg-main/90 text-white"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
