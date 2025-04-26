"use client";

import { DeleteResidentModal } from "@/components/modal/delete-resident-modal";
import { EditResidentModal } from "@/components/modal/edit-resident-modal";
import { InactivateResidentModal } from "@/components/modal/inactive-resident-modal";
import { Button } from "@/components/ui/button";
import { Resident } from "@/types/Resident";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2, UserX } from "lucide-react";
import { useEffect, useState } from "react";

export const columns: ColumnDef<Resident>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "houseNumber",
    header: "Número da Casa",
  },
  {
    accessorKey: "contact",
    header: "Contacto",
  },
  {
    accessorKey: "bi",
    header: "Bilhete de Identidade",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "active",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.getValue("active") as boolean;
      return (
        <span
          className={`inline-block px-2 py-1 rounded-md ${
            isActive ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isActive ? "Activo" : "Inactivo"}
        </span>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const isActive = row.getValue(columnId) as boolean;
      if (filterValue === undefined) return true;
      return isActive === filterValue;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data de Criação",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const resident = row.original;
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
      const [isInactivateModalOpen, setIsInactivateModalOpen] = useState(false);
      const [token, setToken] = useState<string | null>(null);

      useEffect(() => {
        const getCookie = (name: string) => {
          return document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${name}=`))
            ?.split("=")[1];
        };

        const fetchedToken = getCookie("token");
        setToken(fetchedToken || null);
      }, []);

      return (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditModalOpen(true)}
            title="Editar morador"
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDeleteModalOpen(true)}
            title="Apagar morador"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsInactivateModalOpen(true)}
            title="Inactivar morador"
            disabled={!resident.active}
          >
            <UserX className="h-4 w-4 text-gray-600" />
          </Button>
          {isEditModalOpen && token && (
            <EditResidentModal
              resident={resident}
              token={token}
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
            />
          )}
          {isDeleteModalOpen && token && (
            <DeleteResidentModal
              residentId={resident.id}
              residentName={resident.name}
              token={token}
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
            />
          )}
          {isInactivateModalOpen && token && (
            <InactivateResidentModal
              residentId={resident.id}
              residentName={resident.name}
              token={token}
              isOpen={isInactivateModalOpen}
              onClose={() => setIsInactivateModalOpen(false)}
            />
          )}
        </div>
      );
    },
  },
];
