import { useEffect, useState } from "react";
import { replace, useLocation, useNavigate } from "react-router-dom";
import { CartItemType } from "#/utils/types";
import { formatNumber } from "#/utils/formatter";
import KoreanAddressForm from "#/common/KoreanAddressForm";
import ProductImage from "#/common/ProductImage";
import { Button, Spinner } from "@material-tailwind/react";
import { useMutation } from "@apollo/client";
import { CREATE_ORDER_FROM_CART, CREATE_ORDER_FROM_CART_ITEM } from "#/apollo/mutation";
import ConfirmationDialog from "#/common/ConfirmationDialog";
import NotificationDialog from "#/common/NotificationDialog";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "#/utils/auth";

interface AddressData {
  zipCode: string;
  address: string;
  detailAddress: string;
}
const OrderSheet = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState<CartItemType[]>([]);
  const [isMultipleItems, setIsMultipleItems] = useState(false);
  const [cartId, setCartId] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [isOrderError, setIsOrderError] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUserInfo, setCurrentUserInfo] = useState({ userId: "", userRole: "" });

  const [addressData, setAddressData] = useState<AddressData>({
    zipCode: "",
    address: "",
    detailAddress: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);

    if (storedToken) {
      const decodedToken = jwtDecode<JwtPayload>(storedToken);
      setCurrentUserInfo(decodedToken);
    }
  }, [location, token]);
  const handleAddressChange = (newAddressData: AddressData) => {
    setAddressData(newAddressData);
  };

  const [createOrderCartFC, { loading, error }] = useMutation(CREATE_ORDER_FROM_CART);
  const [createOrderItemFC, { loading: itemLoading, error: itemError }] = useMutation(
    CREATE_ORDER_FROM_CART_ITEM
  );

  useEffect(() => {
    if (location.state && location.state.selectedItems) {
      const decodedItems = JSON.parse(decodeURIComponent(location.state.selectedItems));
      setSelectedItems(decodedItems);

      if (location.state.cartId) {
        const decodedCartId = JSON.parse(decodeURIComponent(location.state.cartId));
        setCartId(decodedCartId);
      }

      setIsMultipleItems(location.state.isMultipleItems);
    }
  }, [location.state]);

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const itemPrice = item.product.sale || item.product.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const handleCreateOrder = () => {
    try {
      if (!addressData.address) {
        alert("주소를 입력해 주세요.");
        setPayOpen(false);
        return;
      }
      if (isMultipleItems) {
        createOrderCartFC({
          variables: {
            cart_id: cartId,
            address: `${addressData.address}, ${addressData.detailAddress} (${addressData.zipCode})`,
          },
          onCompleted: () => {
            navigate(`/user/${currentUserInfo?.userId}/pay?pageStatus=1`, { replace: true });
          },
          onError: (error) => {
            console.error("Order creation error:", error);
            setIsOrderError(true);
          },
        });
      } else {
        createOrderItemFC({
          variables: {
            cart_id: cartId,
            cart_item_id: selectedItems[0].id,
            address: `${addressData.address}, ${addressData.detailAddress} (${addressData.zipCode})`,
          },
          onCompleted: () => {
            navigate(`/user/${currentUserInfo?.userId}/pay`);
          },
          onError: (error) => {
            console.error("Order creation error:", error);
            setIsOrderError(true);
          },
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsOrderError(true);
    }
  };

  return (
    <div className="container mx-auto p-4 border border-solid border-gray-400 rounded-md mt-4">
      <ConfirmationDialog
        isOpen={payOpen}
        message="결제하시겠습니까?"
        onConfirm={handleCreateOrder}
        children={<>{(loading || itemLoading) && <Spinner />}</>}
        onCancel={() => setPayOpen(false)}
      />
      <NotificationDialog
        isOpen={isOrderError}
        title="ERROR!!"
        message={`주문 중에 에러가 발생했습니다. ${error ? error?.message : itemError?.message}`}
        onClose={() => setIsOrderError(false)}
      />

      <h1 className="text-2xl font-bold mb-4 border-b-4 border-solid border-gray-400 py-2">
        주문서
      </h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          {isMultipleItems ? "선택한 상품들" : "주문 상품"}
        </h2>
        <div className="flex flex-col border-t border-solid  border-gray-200">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="flex w-full justify-start content-center border-b border-solid  border-gray-200"
            >
              <div className="p-4 flex justify-start items-center w-[400px] border-r border-solid  border-gray-200">
                <div>
                  <ProductImage
                    imagePath={item.product.main_image_path}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-lg object-contain mr-4"
                  />
                </div>
                <div className="flex flex-col text-base font-extrabold text-gray-700">
                  <div className="text-base font-extrabold text-gray-800">{item.product.name}</div>
                  <div>{formatNumber(item.product.price)}원</div>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-4 justify-center content-center items-center">
                <div className="w-full text-sm font-base">
                  <span>상품 주문 수량: </span>
                  {item.quantity}개
                </div>
                {item.product?.sale ? (
                  <div className="w-full">
                    <div className="text-sm font-semibold text-gray-700">판매가</div>
                    <div className="text-xl font-bold text-gray-800">
                      {formatNumber(item.product.sale)}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm font-semibold text-gray-700">판매가</div>
                    <div className="text-base font-bold text-gray-800">
                      {formatNumber(item.product.price)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 w-fit ml-auto mr-10">
        <h2 className="text-xl font-semibold mb-2 ml-auto">총 주문 금액</h2>
        <div className="text-lg w-fit font-bold ml-auto">{formatNumber(calculateTotal())}원</div>
      </div>

      <div className="mb-4 w-[500px]">
        <h2 className="text-lg font-semibold mb-2">배송지 정보</h2>
        <KoreanAddressForm onAddressChange={handleAddressChange} />
      </div>

      <div className="flex justify-center content-center w-full">
        <Button
          loading={loading || itemLoading}
          onClick={() => setPayOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          결제하기
        </Button>
      </div>
    </div>
  );
};

export default OrderSheet;
