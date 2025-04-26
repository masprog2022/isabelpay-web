import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteResident } from "@/services/residents.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteResidentModalProps {
  residentId: number;
  residentName: string;
  token: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteResidentModal({
  residentId,
  residentName,
  token,
  isOpen,
  onClose,
}: DeleteResidentModalProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteResident(token, residentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      toast.success(
        "Ação realizada com sucesso! O morador foi inativado ou removido."
      );
      onClose();
    },
    onError: (error) => {
      toast.error(`Falha ao processar o morador: ${error.message}`);
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Ação</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja prosseguir? O morador{" "}
            <span className="font-semibold">{residentName}</span> será inativado
            se estiver associado a pagamentos, ou removido permanentemente se
            não houver pagamentos associados.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Processando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
