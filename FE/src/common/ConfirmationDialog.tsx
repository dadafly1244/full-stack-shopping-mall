import React, { ReactNode } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  children,
}) => {
  return (
    <Dialog open={isOpen} size="xs" handler={onCancel}>
      <DialogHeader className="text-base font-bold">확인</DialogHeader>
      <DialogBody className="flex flex-col justify-center content-center">
        <div className="text-sm font-bold text-center">{message}</div>
        {!!children && children}
      </DialogBody>
      <DialogFooter className="flex w-full justify-center ">
        <Button variant="outlined" onClick={onCancel} className="mr-1">
          취소
        </Button>
        <Button variant="filled" onClick={onConfirm}>
          확인
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmationDialog;
