"use client";

import {
  Banknote,
  CreditCard,
  DollarSign,
  Home,
  Menu,
  Settings,
  SquareChartGantt,
  UserCog2,
  UserRound,
  Users,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/features/nav-main";
import { NavProjects } from "@/components/features/nav-projects";
import { TeamSwitcher } from "@/components/features/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  teams: [
    {
      name: "Isabelpay Inc.",
      logo: DollarSign,
      plan: "Isabelpay@masprog.co.ao",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },

    {
      title: "Moradores",
      url: "/resident",
      icon: Users,
    },
    {
      title: "Pagamentos",
      url: "/payment",
      icon: SquareChartGantt,
    },
    {
      title: "Devedores",
      url: "/debtors",
      icon: UserCog2,
    },
    {
      title: "Saídas",
      url: "/output",
      icon: CreditCard,
    },

    {
      title: "Relatórios",
      url: "/report",
      icon: Menu,
    },
    /*{
      title: "Cliente",
      url: "/customer",
      icon: User,
    },
    {
      title: "Pagamento",
      url: "/payment",
      icon: CreditCard,
    },*/
  ],
  projects: [
    {
      name: "Usuários",
      url: "/user",
      icon: UserRound,
    },
    {
      name: "Histórico Pagamentos",
      url: "/history",
      icon: Banknote,
    },

    {
      name: "Definição",
      url: "/setting",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>{/*<NavUser user={data.user} />*/}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
