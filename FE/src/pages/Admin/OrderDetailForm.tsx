import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Card,
  CardHeader,
  CardBody,
  Typography,
  List,
  ListItem,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Button,
} from "@material-tailwind/react";
import { Gender, ProductStatus, UserStatus } from "#/utils/types";
import { formatNumber } from "#/utils/formatter";

// Define types
type Product = {
  id: string;
  name: string;
  sale?: number;
  price: number;
  desc: string;
  main_image_path: string;
  desc_images_path?: string[];
  is_deleted: boolean;
  status: ProductStatus;
};

type OrderDetail = {
  id: string;
  quantity: number;
  price_at_order: number;
  product: Product;
};

type User = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  gender: Gender;
  phone_number?: string;
  status: UserStatus;
};

type ModalProps = {
  user: User;
  orderDetails: OrderDetail[];
  isOpen: boolean;
  onClose: (p: boolean) => void;
};

const UserOrderModal: React.FC<ModalProps> = ({ user, orderDetails, isOpen, onClose }) => {
  const [openAccordion, setOpenAccordion] = React.useState(0);
  // const buttonRef = useRef(null);
  const handleOpenAccordion = (value: number) => {
    setOpenAccordion(openAccordion === value ? 0 : value);
  };

  const handleCloseButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onClose(false);
  };

  return (
    <Dialog open={isOpen} handler={() => onClose(true)} size="xl">
      <DialogHeader>
        <span>User Order Details</span>
        <Button
          className="p-1 ml-auto bg-transparent border-0 text-gray-600 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
          onClick={(e) => handleCloseButton(e)}
          // ref={buttonRef}
        >
          <span className="bg-transparent text-gray-600 h-6 w-6 text-2xl block outline-none focus:outline-none">
            ×
          </span>
        </Button>
      </DialogHeader>
      <DialogBody divider className="h-[calc(100vh-400px)] ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gray-100 h-[calc(100vh-450px)]">
            <CardBody>
              <CardHeader className="flex justify-center bg-gray-400">
                <Typography variant="h5" color="white">
                  주문고객
                </Typography>
              </CardHeader>
              <List>
                <ListItem>Name: {user.name}</ListItem>
                <ListItem>Email: {user.email}</ListItem>
                <ListItem>Gender: {user.gender}</ListItem>
                <ListItem>Phone: {user.phone_number}</ListItem>
                <ListItem>Status: {user.status}</ListItem>
              </List>
            </CardBody>
          </Card>
          <Card className="overflow-y-auto">
            <CardBody>
              <CardHeader className="flex justify-center bg-gray-400">
                <Typography variant="h5" color="white">
                  주문상세
                </Typography>
              </CardHeader>
              {orderDetails?.map((orderDetail, index) => (
                <Accordion
                  key={orderDetail.id}
                  open={openAccordion === index + 1}
                  icon={<Icon id={index + 1} open={openAccordion} />}
                >
                  <AccordionHeader onClick={() => handleOpenAccordion(index + 1)}>
                    <div className="flex justify-between w-full">
                      <div>{orderDetail.product.name}</div>
                      <div>수량: {orderDetail.quantity}</div>
                    </div>
                  </AccordionHeader>
                  <AccordionBody>
                    <List>
                      <ListItem>주문시 가격: ₩{formatNumber(orderDetail.price_at_order)}</ListItem>
                      <ListItem>
                        현재 가격: ₩
                        {formatNumber(
                          orderDetail.product.sale
                            ? orderDetail.product.sale
                            : orderDetail.product.price
                        )}
                      </ListItem>
                      <ListItem>
                        할인율:{"  "}
                        {orderDetail.product.sale
                          ? ((orderDetail.product.sale - orderDetail.product.price) /
                              orderDetail.product.price) *
                            100
                          : 0}
                        %
                      </ListItem>
                      <ListItem>판매상태: {orderDetail.product.status}</ListItem>
                      <ListItem>Description: {orderDetail.product.desc}</ListItem>
                    </List>
                  </AccordionBody>
                </Accordion>
              ))}
            </CardBody>
          </Card>
        </div>
      </DialogBody>
    </Dialog>
  );
};

function Icon({ id, open }: { id: number; open: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${id === open ? "rotate-180" : ""} h-5 w-5 transition-transform`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default UserOrderModal;
