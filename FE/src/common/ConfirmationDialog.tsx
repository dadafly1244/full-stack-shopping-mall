import React from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={isOpen} handler={onCancel}>
      <DialogHeader>확인</DialogHeader>
      <DialogBody divider>{message}</DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onCancel} className="mr-1">
          취소
        </Button>
        <Button variant="gradient" color="green" onClick={onConfirm}>
          확인
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmationDialog;
