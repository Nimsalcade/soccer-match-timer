import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, HelpCircle, CheckCircle } from "lucide-react";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "warning" | "question" | "success";
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "question",
}: ConfirmationDialogProps) {
  const icons = {
    warning: AlertTriangle,
    question: HelpCircle,
    success: CheckCircle,
  };

  const Icon = icons[variant];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl p-6">
        <AlertDialogHeader className="items-center text-center">
          <div className="mb-4">
            <Icon className={`h-16 w-16 ${
              variant === "warning" ? "text-destructive" : 
              variant === "success" ? "text-primary" : 
              "text-muted-foreground"
            }`} />
          </div>
          <AlertDialogTitle className="text-xl font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2">
          <AlertDialogCancel 
            className="m-0 h-12"
            data-testid="button-cancel"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            className="m-0 h-12"
            onClick={onConfirm}
            data-testid="button-confirm"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
