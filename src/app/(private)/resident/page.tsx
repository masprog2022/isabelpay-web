"use client";

import { AppSidebar } from "@/components/features/app-sidebar";
import { ResidentForm } from "@/components/forms/resident-form";
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
import { getResidents } from "@/services/residents.service";
import { Resident } from "@/types/Resident";
import getCookie from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function ResidentPage() {
  const [isOpen, setIsOpen] = useState(false);

  // Usando React Query para buscar dados
  const { data: residents = [], isLoading } = useQuery<Resident[]>({
    queryKey: ["residents"],
    queryFn: async () => {
      const token = getCookie("token") || "";
      return getResidents(token);
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
            <h1 className="text-2xl font-bold text-gray-900">Morador</h1>
            <p className="text-sm text-gray-600 mt-1">
              Lista de moradores registados
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2 cursor-pointer">
                <Plus className="h-4 w-4" />
                <span>Adicionar Morador</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Morador</DialogTitle>
              </DialogHeader>
              <ResidentForm setIsOpen={setIsOpen} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="p-6">
          <div className="rounded-md">
            {isLoading ? (
              <div>Carregando...</div>
            ) : (
              <DataTable columns={columns} data={residents} />
            )}
          </div>
        </div>
        <Toaster richColors />
      </SidebarInset>
    </SidebarProvider>
  );
}
