import { useEffect, useState } from "react";
import Breadcrumb from "#/common/Breadcrumb";
import NotificationDialog from "#/common/NotificationDialog";
import { Button, Spinner } from "@material-tailwind/react";
import { GET_USER_ORDERS } from "#/apollo/query";
import { useLazyQuery, useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "#/utils/auth";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useFormatDate } from "#/hooks/useFormatDate";
import ProductImage from "#/common/ProductImage";
import { formatNumber } from "#/utils/formatter";
import { cn } from "#/utils/utils";
import CircularPagination from "#/common/Pagenation";
import { CANCEL_ORDER } from "#/apollo/mutation";
import { Link } from "react-router-dom";

const ORDER_STATE = {
  READY_TO_ORDER: "주문 확인 전",
  ORDER: "주문",
  DELIVERED: "배송중",
  CANCELLED: "주문 취소",
  REFUND: "환불 완료",
  UNKNOWN: "상세불명",
};

export const PAGE_SIZE = 8;
const OrderItem = ({ order, onRefresh }) => {
  const params = useParams();
  const formattedDate = useFormatDate({
    date: order.created_at,
    options: {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  });

  const [isCancelErrorOpen, setIsCancelErrorOpen] = useState(false);
  const [cancelOrderFc, { loading: cancelLoading, error: cancelError }] = useMutation(CANCEL_ORDER);

  const handleCancelOrder = () => {
    cancelOrderFc({
      variables: {
        user_id: params.userId,
        order_id: order.id,
      },
      onCompleted: () => {
        onRefresh(true);
      },
      onError: () => {
        setIsCancelErrorOpen(true);
      },
    });
  };
  return (
    <Link
      to={`/user/${params.userId}/order/status/${order.id}`}
      className="border border-solid border-gray-200 rounded-xl p-4 "
    >
      <NotificationDialog
        isOpen={isCancelErrorOpen}
        title="ERROR!!"
        message={`주문취소 중 에러가 발생했습니다. ${cancelError?.message}`}
        onClose={() => setIsCancelErrorOpen(false)}
      />
      <div className="flex items-center gap-4">
        <div className="text-lg font-extrabold text-gray-800">{ORDER_STATE[order.status]}</div>
        <div className="flex text-xs gap-2">
          <div>주문 시간</div>
          <div>{formattedDate}</div>
        </div>
      </div>
      <div className="flex relative">
        <ProductImage
          imagePath={order.order_details[0].product.main_image_path}
          alt={order.order_details[0].product.name}
          className="w-24 h-24 rounded-lg object-contain mr-4"
        />

        <div className="flex flex-col">
          <div className="flex text-sm items-center gap-2">
            <div className="flex text-lg">{formatNumber(order.total_price)}원</div>
          </div>
          <div className="flex items-center text-sm  gap-2">
            <div>{order.address}</div>
          </div>
        </div>
        <div className="absolute  bottom-0 right-0">
          <Button
            loading={cancelLoading}
            variant="outlined"
            onClick={handleCancelOrder}
            className="p-2"
            disabled={order.status !== "READY_TO_ORDER"}
          >
            주문취소
          </Button>
        </div>
      </div>
    </Link>
  );
};
const PaymentList = () => {
  const location = useLocation();

  const [data, setData] = useState({
    orders: [],
    pageInfo: {
      currentPage: 1,
      pageSize: 1,
      totalCount: 1,
      totalPages: 1,
    },
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const [pageStatus, setPageStatus] = useState(Number(searchParams.get("pageStatus")) || 1);

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUserInfo, setCurrentUserInfo] = useState({ userId: "", userRole: "" });
  const [isInfoErrorOpen, setIsInfoErrorOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    setToken(storedToken);

    if (storedToken) {
      const decodedToken = jwtDecode<JwtPayload>(storedToken);
      setCurrentUserInfo(decodedToken);
    }
  }, [location, token]);
  const [getOrdersFc, { loading, error }] = useLazyQuery(GET_USER_ORDERS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (currentUserInfo.userId) {
      getOrdersFc({
        variables: { user_id: currentUserInfo.userId, page: pageStatus, pageSize: PAGE_SIZE },
        onCompleted: (fetchedData) => {
          if (fetchedData?.getUserOrders) {
            setData(fetchedData.getUserOrders);
          }
          setRefresh(false);
        },
        onError: () => {
          setIsInfoErrorOpen(true);
        },
      });
    }
  }, [currentUserInfo.userId, getOrdersFc, pageStatus, refresh]);

  const handleChangePage = (p: number) => {
    setPageStatus(p);
    searchParams.set("pageStatus", String(p));
    setSearchParams(searchParams);
  };

  return (
    <div>
      <NotificationDialog
        isOpen={isInfoErrorOpen}
        title="ERROR!!"
        message={`장바구니 데이터를 불러오는데 에러가 발생했습니다. ${error?.message}`}
        onClose={() => setIsInfoErrorOpen(false)}
      />
      <div className="py-5">
        <Breadcrumb />
      </div>
      <div>
        {loading && <Spinner />}
        {/* <div>
          <Select
            label="주문 상태"
            // value={searchTerm}
            // onChange={(value) => value && onSearchTermChange(value)}
            className="!max-w-[288px]"
            containerProps={{
              className: "min-w-[288px] max-w-[288px]",
            }}
          >
            <Option value="READY_TO_ORDER">주문 확인 전</Option>
            <Option value="ORDER">주문</Option>
            <Option value="DELIVERED">배송중</Option>
            <Option value="CANCELLED">주문 취소</Option>
            <Option value="REFUND">환불 완료</Option>
            <Option value="UNKNOWN">상세불명</Option>
          </Select>
        </div> */}
        {data.orders && data.orders.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.orders.map((order) => (
              <OrderItem key={order.id} order={order} onRefresh={setRefresh} />
            ))}
          </div>
        )}
        <div className={cn("w-full flex justify-center content-center")}>
          <CircularPagination
            currentPage={pageStatus}
            totalPages={data?.pageInfo?.totalPages || 1}
            onPageChange={handleChangePage}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentList;
