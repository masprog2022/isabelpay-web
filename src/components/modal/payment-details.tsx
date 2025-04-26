"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPaymentById } from "@/services/payment.service";
import { Payment } from "@/types/Payment";
import getCookie from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useState } from "react";

interface PaymentDetailsModalProps {
  id: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentDetailsModal({
  id,
  isOpen,
  onClose,
}: PaymentDetailsModalProps) {
  const {
    data: payment,
    isLoading,
    isError,
  } = useQuery<Payment>({
    queryKey: ["payment", id], // Ajustar queryKey para evitar conflitos
    queryFn: async () => {
      const token = getCookie("token") || "";
      return getPaymentById(id, token);
    },
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Adicionar log para inspecionar os dados retornados
  console.log("Dados do pagamento:", payment);

  const [showAllYears, setShowAllYears] = useState(false);

  if (!isOpen) return null;

  const statusColors: Record<string, string> = {
    PAGO: "bg-green-600 text-white",
    "NÃO PAGO": "bg-red-600 text-white",
  };

  // Extrair o ano do pagamento a partir de paymentDate
  const paymentYear = payment?.paymentDate
    ? new Date(
        payment.paymentDate.split(" ")[0].split("/").reverse().join("-")
      ).getFullYear()
    : "Não informado";

  // Agrupar meses pagos por ano
  const groupedMonthsByYear: {
    [year: string]: { months: string[] };
  } = {};
  if (payment?.paidMonths) {
    payment.paidMonths.forEach((month) => {
      const year = month.year.toString();
      if (!groupedMonthsByYear[year]) {
        groupedMonthsByYear[year] = {
          months: [],
        };
      }
      groupedMonthsByYear[year].months.push(
        month.month.substring(0, 3).toUpperCase()
      );
    });
  }

  const years = Object.keys(groupedMonthsByYear).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );
  const initialYearsLimit = 3;
  const displayedYears = showAllYears
    ? years
    : years.slice(0, initialYearsLimit);
  const hasMoreYears = years.length > initialYearsLimit;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl dark:bg-neutral-950 dark:text-white">
        <DialogHeader>
          <DialogTitle>Detalhes do Pagamento #{id}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : isError || !payment ? (
          <div className="py-4 text-red-500">
            Não foi possível carregar os detalhes do pagamento.
          </div>
        ) : (
          <div className="space-y-6">
            {/* Informações do Pagamento */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mt-8">
                Informações do Pagamento
              </h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong className="font-medium text-black">
                    Nome do Morador:
                  </strong>{" "}
                  {payment.residentName || "Não informado"}
                </p>
                <p className="text-sm">
                  <strong className="font-medium">Método de Pagamento:</strong>{" "}
                  {payment.paymentMethod || "Não informado"}
                </p>
                <p className="text-sm">
                  <strong className="font-medium">Data do Pagamento:</strong>{" "}
                  {payment.paymentDate || "Não informado"}
                </p>
                <p className="text-sm">
                  <strong className="font-medium">Ano do Pagamento:</strong>{" "}
                  {paymentYear}
                </p>
              </div>
            </div>

            {/* Meses Pagos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Meses Pagos</h3>
              {payment.paidMonths && payment.paidMonths.length > 0 ? (
                <div>
                  <ul className="space-y-2">
                    {displayedYears.map((year) => (
                      <li key={year} className="text-sm">
                        <p>
                          <strong className="font-medium">Ano: {year}:</strong>{" "}
                          [{groupedMonthsByYear[year].months.join(", ")}]
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
                  Nenhum mês pago encontrado.
                </p>
              )}
            </div>

            {/* Status e Valores */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status e Valores</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong className="font-medium">Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      statusColors[payment.statusPayment] ||
                      "bg-gray-600 text-white"
                    }`}
                  >
                    {payment.statusPayment || "Não informado"}
                  </span>
                </p>
                <p className="text-sm">
                  <strong className="font-medium">Mensalidade por Mês:</strong>{" "}
                  {typeof payment.monthlyFee === "number"
                    ? new Intl.NumberFormat("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                      }).format(payment.monthlyFee)
                    : "Não informado"}
                </p>
                <p className="text-sm">
                  <strong className="font-medium">Total Pago:</strong>{" "}
                  {typeof payment.totalAmount === "number"
                    ? new Intl.NumberFormat("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                      }).format(payment.totalAmount)
                    : "Não informado"}
                </p>
              </div>
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
