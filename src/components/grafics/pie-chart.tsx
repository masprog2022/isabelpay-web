"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

const chartData = [
  { category: "Registrados", count: 150, fill: "var(--color-registered)" },
  { category: "Com Dívidas", count: 25, fill: "var(--color-debtors)" },
  {
    category: "Não Registrados",
    count: 30,
    fill: "var(--color-unregistered)",
  },
  { category: "Inativos", count: 20, fill: "var(--color-inactive)" },
];

const chartConfig = {
  count: {
    label: "Moradores",
  },
  registered: {
    label: "Registrados",
    color: "hsl(var(--chart-1))", // Azul
  },
  debtors: {
    label: "Com Dívidas",
    color: "hsl(var(--chart-2))", // Vermelho
  },
  unregistered: {
    label: "Não Registrados",
    color: "hsl(var(--chart-3))", // Cinza
  },
  inactive: {
    label: "Inativos",
    color: "hsl(var(--chart-4))", // Amarelo
  },
} satisfies ChartConfig;

export function ResidentsPieChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribuição de Moradores</CardTitle>
        <CardDescription>Abril 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              stroke="0"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Registrados aumentaram 2,5% este mês{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Exibindo distribuição dos moradores da vila
        </div>
      </CardFooter>
    </Card>
  );
}
