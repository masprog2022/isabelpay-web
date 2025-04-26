"use client";

import { AppSidebar } from "@/components/features/app-sidebar";
import { ResidentsTrendChart } from "@/components/grafics/bar-chart";
import { ResidentsPieChart } from "@/components/grafics/pie-chart";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getDebtorsSummary,
  getTotalDebt,
  getTotalPaid,
} from "@/services/payment.service";
import { getResidentsSummary } from "@/services/residents.service";
import { UserData } from "@/types/User";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Landmark, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Debtor {
  name: string;
  apartment: string;
  amountDue: number;
  dueDate: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getCookie = (name: string) => {
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
    };

    const token = getCookie("token");
    const userName = getCookie("userName");

    if (token && userName) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          name: decodeURIComponent(userName),
          email: payload.sub,
        });
        setToken(token);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const {
    data: totalPaid = 0,
    isLoading: isLoadingPaid,
    error: errorPaid,
  } = useQuery<number>({
    queryKey: ["totalPaid"],
    queryFn: async () => {
      if (!token) throw new Error("No token available");
      return getTotalPaid(token);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const {
    data: totalDebt = 0,
    isLoading: isLoadingDebt,
    error: errorDebt,
  } = useQuery<number>({
    queryKey: ["totalDebt"],
    queryFn: async () => {
      if (!token) throw new Error("No token available");
      return getTotalDebt(token);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const {
    data: debtorsSummary = { totalDebtors: 0, debtorsPercentage: 0 },
    isLoading: isLoadingDebtors,
    error: errorDebtors,
  } = useQuery<{ totalDebtors: number; debtorsPercentage: number }>({
    queryKey: ["debtorsSummary"],
    queryFn: async () => {
      if (!token) throw new Error("No token available");
      return getDebtorsSummary(token);
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const {
    data: residentsSummary = {
      totalRegisteredActive: 0,
      registeredPercentage: 0,
    },
    isLoading: isLoadingResidents,
    error: errorResidents,
  } = useQuery<{ totalRegisteredActive: number; registeredPercentage: number }>(
    {
      queryKey: ["residentsSummary"],
      queryFn: async () => {
        if (!token) throw new Error("No token available");
        return getResidentsSummary(token);
      },
      enabled: !!token,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }
  );

  const currentYear = 2025;
  const years = [
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3,
  ];

  const formatCurrencyAOA = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />

        <div className="p-6 pb-0 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Condóminio Vila Isabel
            </h1>
            <p className="text-sm text-gray-600 mt-1">Benvindo, {user?.name}</p>
          </div>
          <div>
            <Select defaultValue={String(currentYear)}>
              <SelectTrigger className="w-[120px] border-gray-300">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
          <Card className="bg-gradient-to-tr from-white to-gray-200 border-gray-300 min-h-[10rem]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">
                Total de quotas pagas
              </CardTitle>
              <Landmark className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              {isLoadingPaid ? (
                <div className="text-2xl font-bold text-gray-900 p-1">
                  Carregando...
                </div>
              ) : errorPaid ? (
                <div className="text-2xl font-bold text-red-600 p-1">Erro</div>
              ) : (
                <div className="text-2xl font-bold text-gray-900 p-1">
                  {formatCurrencyAOA(totalPaid)}
                </div>
              )}
              <p className="text-xs text-gray-600">
                Total de valores pagos até a data actual
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-tr from-white to-gray-200 border-gray-300 min-h-[10rem]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">
                Devedores
              </CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              {isLoadingDebtors ? (
                <div className="text-2xl font-bold text-gray-900 p-1">
                  Carregando...
                </div>
              ) : errorDebtors ? (
                <div className="text-2xl font-bold text-red-600 p-1">Erro</div>
              ) : (
                <div className="text-2xl font-bold text-gray-900 p-1">
                  {debtorsSummary.totalDebtors}
                </div>
              )}
              <p className="text-xs text-gray-600">
                {isLoadingDebtors || errorDebtors
                  ? "Carregando..."
                  : `${debtorsSummary.debtorsPercentage}% de moradores com dívidas`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-100 to-white border-gray-200 min-h-[10rem]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">
                Moradores activos
              </CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              {isLoadingResidents ? (
                <div className="text-2xl font-bold text-gray-900 p-1">
                  Carregando...
                </div>
              ) : errorResidents ? (
                <div className="text-2xl font-bold text-red-600 p-1">Erro</div>
              ) : (
                <div className="text-2xl font-bold text-gray-900 p-1">
                  {residentsSummary.totalRegisteredActive}
                </div>
              )}
              <p className="text-xs text-gray-600">
                {isLoadingResidents || errorResidents
                  ? "Carregando..."
                  : `${residentsSummary.registeredPercentage}% Total de 180 Residências`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-red-50 border-gray-200 min-h-[10rem]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">
                Valor total em dívida
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              {isLoadingDebt ? (
                <div className="text-2xl font-bold text-red-600 p-1">
                  Carregando...
                </div>
              ) : errorDebt ? (
                <div className="text-2xl font-bold text-red-600 p-1">Erro</div>
              ) : (
                <div className="text-2xl font-bold text-red-600 p-1">
                  {formatCurrencyAOA(totalDebt)}
                </div>
              )}
              <p className="text-xs text-gray-600">
                Valor total ainda por receber
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos sem Card e sem Título */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6 pb-6">
          <div className="w-full h-[300px]">
            <ResidentsTrendChart />
          </div>
          <div className="w-full h-[300px]">
            <ResidentsPieChart />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
