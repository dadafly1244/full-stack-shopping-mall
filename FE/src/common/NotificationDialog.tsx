import React from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

interface NotificationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({
  isOpen,
  title = "확인",
  message,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} size="xs" handler={onClose}>
      <DialogHeader className="text-base font-bold">{title}</DialogHeader>
      <DialogBody className="text-sm font-bold text-center ">
        <div className="w-full flex flex-col justify-center content-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-16 h-16 fill-red-600 mb-5"
          >
            <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
          </svg>
        </div>
        <span className="w-full whitespace-pre-wrap">{message}</span>
      </DialogBody>
      <DialogFooter className="flex w-full justify-center">
        <Button variant="filled" onClick={onClose}>
          확인
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default NotificationDialog;
