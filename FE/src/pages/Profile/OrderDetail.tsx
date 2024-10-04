import { GET_USER_ORDER } from "#/apollo/query";
import Breadcrumb from "#/common/Breadcrumb";
import NotificationDialog from "#/common/NotificationDialog";
import ProductImage from "#/common/ProductImage";
import { useFormatDate } from "#/hooks/useFormatDate";
import { formatNumber } from "#/utils/formatter";
import { useLazyQuery } from "@apollo/client";
import { Button, Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
const ORDER_STATE = {
  READY_TO_ORDER: "주문 확인 전",
  ORDER: "주문",
  DELIVERED: "배송중",
  CANCELLED: "주문 취소",
  REFUND: "환불 완료",
  UNKNOWN: "상세불명",
};
const OrderDetail = () => {
  const { userId, orderId } = useParams();
  const [orderInfo, setOrderInfo] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [getOrderDetailFc, { loading, error }] = useLazyQuery(GET_USER_ORDER);

  useEffect(() => {
    getOrderDetailFc({
      variables: {
        user_id: userId,
        order_id: orderId,
      },
      onCompleted: (data) => {
        if (data?.getUserOrder) {
          setOrderInfo(data.getUserOrder);
        }
      },
      onError: () => {
        setIsErrorOpen(true);
      },
    });
  }, [getOrderDetailFc, userId, orderId]);

  let date = "";
  useEffect(() => {
    if (orderInfo?.create_id) {
      date = useFormatDate(orderInfo?.create_id);
    }
  }, [orderInfo?.create_id]);

  return (
    <div className="">
      <NotificationDialog
        isOpen={isErrorOpen}
        title="ERROR!!"
        message={`주문취소 중 에러가 발생했습니다. ${error?.message}`}
        onClose={() => setIsErrorOpen(false)}
      />
      <div className="py-5">
        <Breadcrumb />
      </div>
      {loading && <Spinner />}
      {orderInfo && (
        <div className="relative w-full border border-solid border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-4 border-b-4 border-solid border-gray-400 py-2">
            주문 상세
          </h1>
          <div className="border-b border-solid border-gray-200 pb-4">
            <div className="flex flex-col">
              {new Intl.DateTimeFormat("ko-KR", {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).format(orderInfo?.create_id)}
            </div>
            <div className="flex gap-4  text-lg font-bold text-gray-400">
              <div>주문번호</div>
              <div className="text-gray-600 ">{orderInfo.id}</div>
            </div>
          </div>
          <div className="flex gap-4 text-lg font-bold text-gray-400 py-4">
            <div>주문상태</div>
            <div className="text-gray-600 ">{ORDER_STATE[orderInfo.status]}</div>
          </div>
          <div>
            <div className="flex text-lg font-bold text-gray-400">주문 제품 상세</div>
            <div className="flex flex-col w-full gap-4 ">
              {orderInfo?.order_details.length > 0 &&
                orderInfo.order_details.map((order) => {
                  return (
                    <div className="flex border-b border-solid border-gray-200 p-4">
                      <ProductImage
                        imagePath={order.product.main_image_path}
                        alt={order.product.name}
                        className="w-24 h-24 rounded-lg object-contain mr-4"
                      />
                      <div className="ml-5 ">
                        <div className="text-xl font-bold text-gray-800">{order.product.name}</div>
                        <div className="text-lg font-bold text-gray-800">
                          {formatNumber(order.quantity)}개
                        </div>
                        <div className="text-lg font-bold text-gray-800">
                          {formatNumber(order.price_at_order)}원
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-600 ml-auto">
                        총 {formatNumber(order.quantity * order.price_at_order)}원
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="border-y-2 border-solid border-gray-400 flex flex-col p-4">
              <div className="w-fit ml-auto font-bold text-gray-400">주문금액</div>
              <div className="w-fit ml-auto text-2xl font-bold">
                {formatNumber(orderInfo.total_price)}원
              </div>
            </div>
          </div>

          <div className="flex gap-4 py-4">
            <div className="text-lg font-bold text-gray-400">배송주소</div>
            <div className="text-lg font-bold text-gray-600">{orderInfo.address}</div>
          </div>
        </div>
      )}
      <div className="w-full flex justify-end py-4">
        <Link
          to={`/user/${userId}/pay`}
          className="border border-solid border-gray-600 font-bold text-sm p-2 rounded-xl"
        >
          결제내역으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;
