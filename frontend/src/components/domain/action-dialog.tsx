import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  isPending: boolean;
  onConfirm: () => void;
  children?: ReactNode;
};

export function ActionDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  destructive,
  isPending,
  onConfirm,
  children,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button variant="outline" onPress={onClose}>
            <Text>Voltar</Text>
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={isPending}
            onPress={onConfirm}
          >
            <Text>{isPending ? "Salvando…" : confirmLabel}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
