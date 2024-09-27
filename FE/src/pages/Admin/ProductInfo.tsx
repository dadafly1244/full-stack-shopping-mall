import { useEffect, useState } from "react";
import ProductTable from "#/pages/Admin/ProductTable";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { PRODUCT_SEARCH_ADMIN, PRODUCTS_INFO_ADMIN, PRODUCT_DETAILS_ADMIN } from "#/apollo/query";
import { DELETE_PRODUCT_ADMIN, UPDATE_PRODUCT_STATUS_ADMIN } from "#/apollo/mutation";
import { ProductType, ProductStatus, ProductsInfoType, TableColumn } from "#/utils/types";
import ProductSearchComponent from "#/pages/Admin/SearchProduct";

import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Select,
  Option,
  Button,
  Drawer,
  Typography,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

import CircularPagination from "#/common/Pagenation";
import { CategoryTree } from "./CategoryManagement";
import ConfirmationDialog from "#/common/ConfirmationDialog";
import { NavLink } from "react-router-dom";
import { useApolloClient } from "@apollo/client";
import Breadcrumb from "#/common/Breadcrumb";
import { cn } from "#/utils/utils";
export const PAGE_SIZE = 10;

const ProductInfoTab = () => {
  const client = useApolloClient();
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleOpenDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [field, setField] = useState<string>(searchParams.get("searchField") || "");

  const [pageStatus, setPageStatus] = useState(Number(searchParams.get("pageStatus")) || 1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [willDelete, setWillDelete] = useState<ProductType[]>([]);
  const [willUpdate, setWillUpdate] = useState<ProductType[]>([]);
  const [data, setData] = useState<ProductsInfoType>({
    products: [],
    pageInfo: {
      currentPage: 1,
      pageSize: 1,
      totalCount: 1,
      totalPages: 1,
    },
  });

  useEffect(() => {
    searchParams.set("pageStatus", "1");
    setSearchParams(searchParams);
  }, []);

  const {
    data: allData,
    error,
    refetch,
  } = useQuery(PRODUCTS_INFO_ADMIN, {
    variables: {
      page: pageStatus,
      pageSize: PAGE_SIZE,
    },
    onCompleted: (allData) => {
      if (allData.getAllProducts.products.length > 0) {
        setData(allData.getAllProducts);
      }
    },
    fetchPolicy: "network-only",
  });

  const [filteredProducts, { error: filteredError }] = useLazyQuery(PRODUCT_SEARCH_ADMIN, {
    variables: {
      page: pageStatus,
      pageSize: PAGE_SIZE,
    },
  });

  useEffect(() => {
    if (willUpdate[0]?.id)
      client.query({
        query: PRODUCT_DETAILS_ADMIN,
        variables: {
          id: willUpdate[0]?.id,
        },
      });
  }, [client, willUpdate]);

  const [updateState, { error: updateStateError }] = useMutation(UPDATE_PRODUCT_STATUS_ADMIN, {
    variables: {
      page: pageStatus,
      pageSize: PAGE_SIZE,
    },
  });

  const [deleteFc] = useMutation(DELETE_PRODUCT_ADMIN);

  useEffect(() => {
    console.log(searchParams.get("searchTerm"));
    if (searchParams.get("searchTerm")) {
      filteredProducts({
        variables: {
          searchTerm: searchParams.get("searchTerm"),
          field: searchParams.get("searchField"),
          page: 1,
          pageSize: PAGE_SIZE,
        },
        onCompleted: (productsData) => {
          if (productsData?.searchProducts.products.length >= 0) {
            setData(productsData.searchProducts);
          }
        },
      });
    }
  }, [filteredProducts, searchParams]);

  const handleRowClick = (product: ProductType) => {
    setWillUpdate([product]);
    navigate(`/admin/product-info/edit/${product.id}`);
  };

  const handleSelectionChange = (selectedProducts: ProductType[]) => {
    setWillDelete(selectedProducts);
  };

  const handleSearchProducts = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("searchTerm", searchTerm);
    newSearchParams.set("searchField", field === "all" ? "" : field);
    newSearchParams.set("pageStatus", "1");
    setPageStatus(1);
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    if (allData?.getAllProducts) {
      setData(allData.getAllProducts);
    }
  }, [allData?.getAllProducts]);

  const handleResetSearch = () => {
    const newSearchParams = new URLSearchParams();
    setSearchParams(newSearchParams);
    setData(allData.getAllProducts);
    setSearchTerm("");
    setField("");
  };

  const handleUpdateState = async (v: ProductStatus, id: string) => {
    try {
      await updateState({
        variables: {
          id: id,
          status: v as ProductStatus,
        },
        onCompleted: () =>
          refetch({
            variables: {
              page: pageStatus,
              pageSize: PAGE_SIZE,
            },
          }),
      });
    } catch (error) {
      throw new Error(`제품의 상태를 업데이트하는데 실패했습니다.${error}`);
    }
  };

  const handleDeleteProducts = async (productArr: ProductType[]) => {
    setWillUpdate([]);
    try {
      setIsDeleteModalOpen((prev) => !prev);
      productArr.forEach(async (p) => {
        await deleteFc({
          variables: {
            id: p.id,
          },
          onCompleted: () => {
            if (searchParams.get("searchTerm")) {
              console.log(11);
              filteredProducts({
                variables: {
                  searchTerm: searchParams.get("searchTerm"),
                  field: searchParams.get("searchField"),
                  page: 1,
                  pageSize: PAGE_SIZE,
                },
                onCompleted: (productsData) => {
                  handleChangePage(1);
                  if (productsData?.searchProducts.products.length > 0) {
                    setData(productsData.searchProducts);
                  }
                },
              });
            } else {
              refetch({
                variables: {
                  page: pageStatus,
                  pageSize: PAGE_SIZE,
                },
              });
            }
          },
        });
      });
      setWillDelete([]);
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteModal = () => {
    if (willDelete.length === 0) {
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const columns: TableColumn<ProductType>[] = [
    {
      header: "Name",
      key: "name",
      render: (product) => (
        <Tooltip content={product?.name} placement="bottom">
          <Button
            variant="text"
            className="underline max-w-32 p-2"
            onClick={() => handleRowClick(product)}
          >
            <div className="overflow-x-hidden overflow-ellipsis">{product?.name}</div>
          </Button>
        </Tooltip>
      ),
    },
    { header: "정가", key: "price" },
    { header: "판매가", key: "sale" },
    { header: "재고", key: "count" },
    {
      header: "상태",
      key: "status",
      render: (product) => (
        <div className="w-28" onClick={(e) => e.stopPropagation()}>
          <Select
            variant="outlined"
            label="상태"
            onChange={(v) => handleUpdateState(v as ProductStatus, product.id)}
            value={product.status}
            className="!max-w-[7rem]"
            containerProps={{
              className: "min-w-[7rem] max-w-[7rem]",
            }}
          >
            <Option value={ProductStatus.AVAILABLE}>판매가능</Option>
            <Option value={ProductStatus.TEMPORARILY_OUT_OF_STOCK}>일시품절</Option>
            <Option value={ProductStatus.OUT_OF_STOCK}>품절</Option>
            <Option value={ProductStatus.DISCONTINUED}>단종</Option>
            <Option value={ProductStatus.PROHIBITION_ON_SALE}>판매금지</Option>
          </Select>
        </div>
      ),
    },
    {
      header: "삭제",
      key: "is_deleted",
      render: (product) => (
        <div>
          {product.is_deleted && "삭제"}
          {!product.is_deleted && "저장"}
        </div>
      ),
    },
    {
      header: "category",
      key: "category",
      render: (product) => <div>{product.category?.name}</div>,
    },
    {
      header: "Description",
      key: "desc",
      render: (product) => (
        <Tooltip content={product?.desc} placement="bottom">
          <div className="overflow-x-hidden overflow-ellipsis">{product?.desc}</div>
        </Tooltip>
      ),
    },
  ];

  const handleChangePage = (p: number) => {
    setPageStatus(p);
    refetch({
      variables: {
        page: pageStatus,
        pageSize: PAGE_SIZE,
      },
    });
    searchParams.set("pageStatus", String(p));
    setSearchParams(searchParams);
  };

  if (error || filteredError || updateStateError)
    return (
      <div>
        <Breadcrumb />
        <div>
          에러입니다. 어드민 홈 페이지로 돌아가시겠습니까?
          <NavLink to="/admin" replace>
            <Button variant="outlined" className="mr-2">
              확인
            </Button>
          </NavLink>
        </div>
      </div>
    );

  return (
    <div className={cn("pt-5 pb-10")}>
      <Drawer
        open={openDrawer}
        onClose={handleCloseDrawer}
        className="h-full p-4"
        size={800}
        overlayProps={{ className: "fixed" }}
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray">
            카테고리 설정
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={handleCloseDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </IconButton>
        </div>
        <CategoryTree />
      </Drawer>
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        message="선택한 모든 제품을 삭제하시겠습니까??"
        onConfirm={() => handleDeleteProducts(willDelete)}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      <div>
        <Breadcrumb />
        <ProductSearchComponent
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          field={field || ""}
          onFieldChange={setField}
          onSearch={handleSearchProducts}
          onReset={handleResetSearch}
        />
      </div>

      <div className="flex items-center">
        <div className="flex w-full justify-end mb-4">
          <Button variant="outlined" onClick={handleOpenDrawer} className="mr-2">
            카테고리 관리
          </Button>
          <NavLink to="/admin/product-info/new-product">
            <Button variant="outlined" className="mr-2">
              제품생성
            </Button>
          </NavLink>
          <Button variant="outlined" onClick={openDeleteModal} disabled={willDelete.length === 0}>
            제품삭제
          </Button>
        </div>
      </div>
      <ProductTable
        data={data.products}
        columns={columns}
        onSelectionChange={handleSelectionChange}
      />
      <div className={cn("w-full flex justify-center content-center")}>
        <CircularPagination
          currentPage={pageStatus}
          totalPages={data?.pageInfo?.totalPages || 1}
          onPageChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default ProductInfoTab;
