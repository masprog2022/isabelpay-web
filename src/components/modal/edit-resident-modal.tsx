import { EditResidentForm } from "@/components/forms/edit-resident-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Resident } from "@/types/Resident";

interface EditResidentModalProps {
  resident: Resident;
  token: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EditResidentModal({
  resident,
  token,
  isOpen,
  onClose,
}: EditResidentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Morador</DialogTitle>
        </DialogHeader>
        <EditResidentForm resident={resident} token={token} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
