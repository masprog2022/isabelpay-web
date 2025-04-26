"use client";

import { NotifyOverdueForm } from "@/components/forms/notify-overdue-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { useState } from "react";

interface NotifyOverdueModalProps {
  children?: React.ReactNode;
}

export function NotifyOverdueModal({ children }: NotifyOverdueModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notificar Devedores
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notificar Devedores</DialogTitle>
        </DialogHeader>
        <NotifyOverdueForm setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
