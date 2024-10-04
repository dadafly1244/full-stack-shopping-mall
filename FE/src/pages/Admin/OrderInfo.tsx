import { useEffect, useState, useCallback } from "react";
import Table from "#/common/Table";
import { GET_ALL_ORDERS, SEARCH_ORDER } from "#/apollo/query";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  sortingItem,
  SortState,
  TableColumn,
  OrderStatus,
  Gender,
  UserStatus,
  ProductStatus,
  OrderType,
  OrdersInfoType,
} from "#/utils/types";
import Modal from "#/common/Modal";
import UpdateOrderForm from "#/common/UpdateOrderForm";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "./ProductInfo";
import CircularPagination from "#/common/Pagenation";
import { Button, Input, Spinner } from "@material-tailwind/react";
import UserOrderModal from "./OrderDetailForm";

const init_order: OrderType = {
  id: "",
  user_id: "",
  status: OrderStatus.READY_TO_ORDER as OrderStatus,
  address: "",
  is_deleted: false,
  total_price: "",
  created_at: "",
  updated_at: "",
  user: {
    id: "",
    user_id: "",
    name: "",
    email: "",
    gender: Gender.PREFER_NOT_TO_SAY as Gender,
    phone_number: "",
    status: UserStatus.ACTIVE as UserStatus,
  },
  order_details: [
    {
      id: "",
      quantity: 0,
      price_at_order: 0,
      product: {
        id: "",
        name: "",
        sale: 0,
        price: 0,
        desc: "",
        main_image_path: "",
        desc_images_path: [],
        is_deleted: false,
        status: ProductStatus.AVAILABLE as ProductStatus,
      },
    },
  ],
};

const OrderInfoTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [shouldSearch, setShouldSearch] = useState(searchParams.get("searchOpen") === "true");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [pageState, setPageState] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedOrder, setClickedOrder] = useState(init_order);
  const [isOpenOrderDetailsModal, setIsOpenOrderDetailsModal] = useState(false);
  const [data, setData] = useState<OrdersInfoType>({
    orders: [],
    pageInfo: {
      currentPage: 1,
      pageSize: 1,
      totalCount: 1,
      totalPages: 1,
    },
  });
  const [sortState] = useState<SortState<sortingItem>>({
    user_id: "none",
    name: "none",
    email: "none",
    phone_number: "none",
  });

  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get("searchTerm") || "");

  const {
    data: allData,
    loading,
    error,
  } = useQuery(GET_ALL_ORDERS, {
    variables: {
      page: pageState,
      pageSize: PAGE_SIZE,
    },
  });

  const [filteredOrder, { loading: filteredLoading, error: filteredError }] =
    useLazyQuery(SEARCH_ORDER);

  const performSearch = useCallback(async () => {
    const { data: ordersData } = await filteredOrder({
      variables: {
        searchTerm: searchParams.get("searchTerm"),
      },
    });
    if (ordersData?.searchOrders) {
      setData((prev) => ({ ...prev, orders: ordersData.searchOrders }));
    }
  }, [filteredOrder, searchParams]);

  useEffect(() => {
    if (isInitialLoad) {
      if (searchParams.get("searchTerm")) {
        performSearch();
      } else {
        if (allData?.getAllOrders) {
          setData(allData.getAllOrders);
        }
      }
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, searchParams, allData, performSearch]);

  const handleRowClick = (order: OrderType) => {
    console.log("Clicked user:", order);
    // openModal(order);
  };

  const handleSelectionChange = (selectedUsers: OrderType[]) => {
    console.log("Selected users:", selectedUsers);
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setSearchParams(new URLSearchParams());
  };

  const handleOpenOrderDetail = () => {
    setIsOpenOrderDetailsModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const columns: TableColumn<OrderType, sortingItem>[] = [
    { header: "ID", key: "id" },
    { header: "User ID", key: "user_id", sort: sortState.user_id as keyof sortingItem },
    { header: "status", key: "status" },
    { header: "address", key: "address" },
    { header: "Total Price", key: "total_price" },
    { header: "Is Deleted", key: "is_deleted" },
    { header: "CreatedAt", key: "created_at" },
    { header: "UpdatedAt", key: "updated_at" },
    {
      header: "Details",
      key: "order_details",
      render: (Order: OrderType) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Button onClick={handleOpenOrderDetail}>상세보기</Button>
          <UserOrderModal
            user={Order.user}
            orderDetails={Order.order_details}
            isOpen={isOpenOrderDetailsModal}
            onClose={(p: boolean) => setIsOpenOrderDetailsModal(p)}
          />
        </div>
      ),
    },
  ];

  const handleSearch = () => {
    searchParams.set("searchTerm", searchTerm);
    setSearchParams(searchParams);
    performSearch();
  };

  if (error || filteredError) return <p>Error: {error?.message || filteredError?.message}</p>;

  return (
    <div className="pt-5 pb-10">
      {/* <UpdateUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        order={clickedOrder as OrderType}
      /> */}
      <div className="flex justify-start content-center">
        <Input
          onChange={handleChange}
          placeholder="새로운 카테고리 이름을 입력해 주세요"
          crossOrigin={undefined}
          value={searchTerm}
        />
        <Button loading={filteredLoading} size="sm" className="break-keep" onClick={handleSearch}>
          검색
        </Button>
        <Button size="sm" className="break-keep" onClick={handleResetSearch}>
          초기화
        </Button>
      </div>
      {loading && <Spinner />}
      <Table<OrderType, sortingItem>
        title="Order List"
        data={data?.orders}
        sortState={sortState}
        columns={columns}
        // onSortClick={handleSortClick}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
      />
      <div className="w-full flex justify-center content-center">
        <CircularPagination
          currentPage={pageState}
          totalPages={data?.pageInfo?.totalPages || 1}
          onPageChange={(p) => setPageState(p)}
        />
      </div>
    </div>
  );
};

// interface UpdateUserModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   order: OrderType;
// }

// export const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ isOpen, onClose, order }) => {
//   return (
//     <Modal isOpen={isOpen} title="사용자 정보 수정" onClose={onClose}>
//       <UpdateOrderForm order={order} onClose={onClose} />
//     </Modal>
//   );
// };

export default OrderInfoTab;
