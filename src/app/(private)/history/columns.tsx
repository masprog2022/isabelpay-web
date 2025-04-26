"use client";

import { PaymentStatus } from "@/types/PaymentStatus";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<PaymentStatus>[] = [
  {
    accessorKey: "morador",
    header: "Morador",
  },
  {
    accessorKey: "janeiro",
    header: "Janeiro",
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-md ${
          row.getValue("janeiro") === "Pago"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.getValue("janeiro")}
      </span>
    ),
  },
  {
    accessorKey: "fevereiro",
    header: "Fevereiro",
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-md ${
          row.getValue("fevereiro") === "Pago"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.getValue("fevereiro")}
      </span>
    ),
  },
  {
    accessorKey: "marco",
    header: "Março",
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-md ${
          row.getValue("marco") === "Pago"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.getValue("marco")}
      </span>
    ),
  },
  {
    accessorKey: "abril",
    header: "Abril",
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-md ${
          row.getValue("abril") === "Pago"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.getValue("abril")}
      </span>
    ),
  },
  {
    accessorKey: "maio",
    header: "Maio",
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-md ${
          row.getValue("maio") === "Pago"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.getValue("maio")}
      </span>
    ),
  },
  {
    accessorKey: "junho",
    header: "Junho",
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-md ${
          row.getValue("junho") === "Pago"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.getValue("junho")}
      </span>
    ),
  },
  {
    accessorKey: "julho",
    header: "Julho",
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-md ${
          row.getValue("julho") === "Pago"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.getValue("julho")}
      </span>
    ),
  },
  {
    accessorKey: "agosto",
    header: "Agosto",
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-md ${
          row.getValue("agosto") === "Pago"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.getValue("agosto")}
      </span>
    ),
  },
  {
    accessorKey: "setembro",
    header: "Setembro",
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-md ${
          row.getValue("setembro") === "Pago"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.getValue("setembro")}
      </span>
    ),
  },
  {
    accessorKey: "Outubro",
    header: "Outubro",
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-md ${
          row.getValue("Outubro") === "Pago"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.getValue("Outubro")}
      </span>
    ),
  },
  {
    accessorKey: "novembro",
    header: "Novembro",
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-md ${
          row.getValue("novembro") === "Pago"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.getValue("novembro")}
      </span>
    ),
  },
  {
    accessorKey: "dezembro",
    header: "Dezembro",
    cell: ({ row }) => (
      <span
        className={`inline-block px-2 py-1 rounded-md ${
          row.getValue("dezembro") === "Pago"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {row.getValue("dezembro")}
      </span>
    ),
  },
];
