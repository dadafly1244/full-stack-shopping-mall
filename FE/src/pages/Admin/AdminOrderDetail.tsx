import { UPDATE_ORDER_STATUS_ADMIN } from "#/apollo/mutation";
import { GET_ORDER } from "#/apollo/query";
import Breadcrumb from "#/common/Breadcrumb";
import NotificationDialog from "#/common/NotificationDialog";
import ProductImage from "#/common/ProductImage";
import { formatNumber } from "#/utils/formatter";
import { OrderStatus } from "#/utils/types";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Select, Spinner, Option } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [orderInfo, setOrderInfo] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isUpdateErrorOpen, setIsUpdateErrorOpen] = useState(false);

  const [getOrderDetailFc, { loading, error }] = useLazyQuery(GET_ORDER);
  const [updateStateFc, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_ORDER_STATUS_ADMIN);

  useEffect(() => {
    if (orderId) {
      getOrderDetailFc({
        variables: {
          order_id: orderId,
        },
        onCompleted: (data) => {
          if (data?.getOrder) {
            setOrderInfo(data.getOrder);
          }
        },
        onError: () => {
          setIsErrorOpen(true);
        },
      });
    }
  }, [getOrderDetailFc, orderId]);

  const handleUpdateState = async (v: OrderStatus, id: string) => {
    try {
      updateStateFc({
        variables: {
          order_id: id,
          status: v,
        },
        onCompleted: () => {
          if (orderId) {
            getOrderDetailFc({
              variables: {
                order_id: orderId,
              },
              onCompleted: (data) => {
                if (data?.getOrder) {
                  setOrderInfo(data.getOrder);
                }
              },
              onError: () => {
                setIsErrorOpen(true);
              },
            });
          }
        },
        onError: () => {
          setIsUpdateErrorOpen(true);
        },
      });
    } catch (error) {
      throw new Error(`주문의 상태를 업데이트하는데 실패했습니다.${error}`);
    }
  };

  return (
    <div className="">
      <NotificationDialog
        isOpen={isErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다. ${error?.message}`}
        onClose={() => setIsErrorOpen(false)}
      />
      <NotificationDialog
        isOpen={isUpdateErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다. 주문 정보를 수정할 수 없습니다.${updateError?.message}`}
        onClose={() => setIsUpdateErrorOpen(false)}
      />
      <div className="py-5">
        <Breadcrumb />
      </div>
      {(loading || updateLoading) && <Spinner />}
      {orderInfo && (
        <div className="relative w-full border border-solid border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-4 border-b-4 border-solid border-gray-400 py-2">
            주문 상세
          </h1>
          <div className="border-b border-solid border-gray-200 pb-4">
            <div className="flex gap-4 ">
              <div>주문 일시</div>
              <div className="flex flex-col">
                {new Intl.DateTimeFormat("ko-KR", {
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }).format(orderInfo?.create_id)}
              </div>
            </div>

            <div className="flex gap-4  text-lg font-bold text-gray-400">
              <div>주문번호</div>
              <div className="text-gray-600 ">{orderInfo.id}</div>
            </div>
          </div>
          <div className="flex gap-4 items-center text-lg font-bold text-gray-400 py-4">
            <div>주문상태</div>
            <Select
              variant="outlined"
              label="상태"
              onChange={(v) => handleUpdateState(v as OrderStatus, orderInfo?.id)}
              value={orderInfo?.status}
              className="!max-w-[10rem]"
              containerProps={{
                className: "min-w-[10rem] max-w-[10rem]",
              }}
            >
              <Option value={OrderStatus.READY_TO_ORDER}>주문 확인 전</Option>
              <Option value={OrderStatus.ORDER}>주문</Option>
              <Option value={OrderStatus.DELIVERED}>배송중</Option>
              <Option value={OrderStatus.CANCELLED}>주문 취소</Option>
              <Option value={OrderStatus.REFUND}>환불 완료</Option>
              <Option value={OrderStatus.UNKNOWN}>상세불명</Option>
            </Select>
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
                      <div className="w-1/6 flex flex-col justify-center text-center text-gray-400">
                        <div>상품명</div>
                        <div className="text-xl font-bold text-gray-800">{order.product.name}</div>
                      </div>
                      <div className="w-1/6 flex flex-col justify-center text-center text-gray-400">
                        <div>수량</div>
                        <div className="text-lg font-bold text-gray-800">
                          {formatNumber(order.quantity)}개
                        </div>
                      </div>

                      <div className="w-1/6 flex flex-col justify-center text-center text-gray-400">
                        <div>주문금액</div>
                        <div className="text-lg font-bold text-gray-800">
                          {formatNumber(order.price_at_order)}원
                        </div>
                      </div>
                      <div className="w-1/6 flex flex-col justify-center text-center text-gray-400">
                        <div>재품 당 주문 총 가격</div>
                        <div className="text-lg font-bold text-gray-600 ">
                          총 {formatNumber(order.quantity * order.price_at_order)}원
                        </div>
                      </div>

                      <div className="w-1/6 flex flex-col justify-center text-center text-gray-400">
                        <div>현재 금액(판매가/정가)</div>
                        <div className="text-lg font-bold text-gray-800">
                          {(order.product?.sale && formatNumber(order.product?.sale)) || "N/A"}원 /{" "}
                          {formatNumber(order.price_at_order)}원
                        </div>
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
            <div className="text-lg font-bold text-gray-400">주문자 정보</div>
            <div className="text-lg font-bold text-gray-600">
              {orderInfo.user.name}(id: {orderInfo.user.user_id})
            </div>
            <div className="text-lg font-bold text-gray-600">{orderInfo.user.phone_number}</div>
            <div className="text-lg font-bold text-gray-600">{orderInfo.user.email}</div>
            <div className="text-lg font-bold text-gray-600">{orderInfo.user.gender}</div>
          </div>
          <div className="flex gap-4 py-4">
            <div className="text-lg font-bold text-gray-400">배송주소</div>
            <div className="text-lg font-bold text-gray-600">{orderInfo.address}</div>
          </div>
        </div>
      )}
      <div className="w-full flex justify-end py-4">
        <Link
          to={`/admin/order-info`}
          className="border border-solid border-gray-600 font-bold text-sm p-2 rounded-xl"
        >
          리스트로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
