import { useEffect, useState, useCallback } from "react";
import { GET_ALL_ORDERS, SEARCH_ORDERS_ADMIN } from "#/apollo/query";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  TableColumn,
  OrderStatus,
  // Gender,
  // UserStatus,
  // ProductStatus,
  OrderType,
  OrdersInfoType,
} from "#/utils/types";

import { useNavigate, useSearchParams } from "react-router-dom";
import CircularPagination from "#/common/Pagenation";
import { Button, Input, Select, Spinner, Tooltip, Option } from "@material-tailwind/react";
import OrderTable from "#/pages/Admin/OrderTable";
import { formatNumber } from "#/utils/formatter";
import Breadcrumb from "#/common/Breadcrumb";
import { UPDATE_ORDER_STATUS_ADMIN } from "#/apollo/mutation";
import NotificationDialog from "#/common/NotificationDialog";
import OrderSearchComponent from "./SearchOrder";

const PAGE_SIZE = 10;

const OrderInfoTab = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pageState, setPageState] = useState(() => {
    const pageParam = searchParams.get("pageState");
    return pageParam ? parseInt(pageParam, 10) : 1;
  });

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isUpdateErrorOpen, setIsUpdateErrorOpen] = useState(false);
  const [isSearchErrorOpen, setIsSearchErrorOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("searchTerm") || "");
  const [field, setField] = useState<string>(searchParams.get("searchField") || "");

  const [data, setData] = useState<OrdersInfoType>({
    orders: [],
    pageInfo: {
      currentPage: 1,
      pageSize: 1,
      totalCount: 1,
      totalPages: 1,
    },
  });

  const [getAllOrders, { loading: allOrdersLoading, error: allOrdersError }] =
    useLazyQuery(GET_ALL_ORDERS);
  const [searchOrders, { loading: searchOrdersLoading, error: searchOrdersError }] =
    useLazyQuery(SEARCH_ORDERS_ADMIN);

  const [updateStateFc, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_ORDER_STATUS_ADMIN);
  const fetchOrders = useCallback(async () => {
    try {
      const { data: ordersData } = await getAllOrders({
        variables: {
          page: pageState,
          pageSize: PAGE_SIZE,
          status: field === "status" ? searchTerm : undefined,
        },
      });
      if (ordersData?.getAllOrders) {
        setData(ordersData.getAllOrders);
      }
    } catch (error) {
      setIsErrorOpen(true);
    }
  }, [getAllOrders, pageState, field, searchTerm]);

  useEffect(() => {
    fetchOrders();
    searchParams.set("pageState", String(pageState));
    setSearchParams(searchParams);
  }, [pageState, fetchOrders, searchParams, setSearchParams]);

  const performSearch = useCallback(async () => {
    if (field === "status") {
      fetchOrders();
    } else {
      try {
        const { data: ordersData } = await searchOrders({
          variables: {
            searchTerm: searchTerm,
          },
        });
        if (ordersData?.searchOrders) {
          setData((prev) => ({ ...prev, orders: ordersData.searchOrders }));
        }
      } catch (error) {
        setIsSearchErrorOpen(true);
      }
    }
  }, [field, fetchOrders, searchOrders, searchTerm, setData]);
  const handleSearch = () => {
    searchParams.set("searchTerm", searchTerm);
    searchParams.set("searchField", field);
    setSearchParams(searchParams);
    performSearch();
  };
  const handleChangePage = (p: number) => {
    setPageState(p);
    searchParams.set("pageState", String(p));
    setSearchParams(searchParams);
  };

  const handleRowClick = (order: OrderType) => {
    navigate(`/admin/order-info/edit/${order.id}`);
  };

  const handleSelectionChange = (selectedOrders: OrderType[]) => {
    console.log("Selected orders:", selectedOrders);
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setField("");
    setSearchParams(new URLSearchParams());
    fetchOrders();
  };

  const columns: TableColumn<OrderType>[] = [
    {
      header: "주문번호",
      key: "id",
      render: (order) => (
        <Tooltip content={order?.id} placement="bottom">
          <Button
            variant="text"
            className="underline max-w-32 p-2"
            onClick={() => handleRowClick(order)}
          >
            <div className="overflow-x-hidden overflow-ellipsis">{order?.id}</div>
          </Button>
        </Tooltip>
      ),
    },
    {
      header: "User",
      key: "user_id",
      render: (order: OrderType) => {
        return (
          <Tooltip content={order.user_id} placement="bottom">
            {order?.user.name}
          </Tooltip>
        );
      },
    },
    {
      header: "상태",
      key: "status",
      render: (order: OrderType) => (
        <div className="w-28" onClick={(e) => e.stopPropagation()}>
          <Select
            variant="outlined"
            label="상태"
            onChange={(v) => handleUpdateState(v as OrderStatus, order?.id)}
            value={order?.status}
            className="!max-w-[7rem]"
            containerProps={{
              className: "min-w-[7rem] max-w-[7rem]",
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
      ),
    },
    {
      header: "Total Price",
      key: "total_price",
      render: (order: OrderType) => <div>{formatNumber(order?.total_price)}원</div>,
    },
    {
      header: "삭제",
      key: "is_deleted",
      render: (order) => (
        <div>
          {order?.is_deleted && "삭제"}
          {!order?.is_deleted && "저장"}
        </div>
      ),
    },
    {
      header: "address",
      key: "address",
      render: (order) => (
        <Tooltip content={order?.address} placement="bottom">
          <div className="overflow-x-hidden   max-w-32 p-2 overflow-ellipsis">{order?.address}</div>
        </Tooltip>
      ),
    },
    {
      header: "변경일",
      key: "updated_at",
      render: (order) => {
        const date = new Intl.DateTimeFormat("ko-KR", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date(order?.updated_at));
        return <div className="overflow-x-hidden overflow-ellipsis">{date}</div>;
      },
    },
    {
      header: "생성일",
      key: "created_at",
      render: (order) => {
        const date = new Intl.DateTimeFormat("ko-KR", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date(order?.created_at));
        return <div className="overflow-x-hidden overflow-ellipsis">{date}</div>;
      },
    },
  ];

  const handleUpdateState = async (v: OrderStatus, id: string) => {
    try {
      updateStateFc({
        variables: {
          order_id: id,
          status: v,
        },
        onCompleted: () => {
          const fetchOrders = async () => {
            try {
              const { data: ordersData } = await getAllOrders({
                variables: {
                  page: pageState,
                  pageSize: PAGE_SIZE,
                },
              });
              if (ordersData?.getAllOrders) {
                setData(ordersData.getAllOrders);
              }
            } catch (error) {
              setIsErrorOpen(true);
            }
          };

          fetchOrders();
          searchParams.set("pageState", String(pageState));
          setSearchParams(searchParams);
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
    <div className="pt-5 pb-10">
      <NotificationDialog
        isOpen={isErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다. 주문 정보를 불러올 수 없습니다.${allOrdersError?.message}`}
        onClose={() => setIsErrorOpen(false)}
      />

      <NotificationDialog
        isOpen={isSearchErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다. 주문 정보를 검색할 수 없습니다.${searchOrdersError?.message}`}
        onClose={() => setIsSearchErrorOpen(false)}
      />
      <NotificationDialog
        isOpen={isUpdateErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다. 주문 정보를 수정할 수 없습니다.${updateError?.message}`}
        onClose={() => setIsUpdateErrorOpen(false)}
      />
      <OrderSearchComponent
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        field={field}
        onFieldChange={setField}
        onSearch={handleSearch}
        onReset={handleResetSearch}
      />
      <div className="py-5">
        <Breadcrumb />
      </div>

      {(allOrdersLoading || updateLoading || searchOrdersLoading) && <Spinner />}
      <OrderTable<OrderType>
        data={data?.orders}
        columns={columns}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
      />
      <div className="w-full flex justify-center content-center">
        <CircularPagination
          currentPage={pageState}
          totalPages={data?.pageInfo?.totalPages || 1}
          onPageChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default OrderInfoTab;
