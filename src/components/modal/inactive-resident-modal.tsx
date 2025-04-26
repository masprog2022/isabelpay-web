"use client";

import { InactivateResidentForm } from "@/components/forms/inactive-resident-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InactivateResidentModalProps {
  residentId: number;
  residentName: string;
  token: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InactivateResidentModal({
  residentId,
  residentName,
  token,
  isOpen,
  onClose,
}: InactivateResidentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inativar Morador: {residentName}</DialogTitle>
        </DialogHeader>
        <InactivateResidentForm
          residentId={residentId}
          residentName={residentName}
          token={token}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
