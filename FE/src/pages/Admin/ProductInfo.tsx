import { useEffect, useState, useCallback } from "react";
import Table from "#/common/Table";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import { PRODUCT_SEARCH_ADMIN, PRODUCTS_INFO_ADMIN } from "#/apollo/query";
import { DELETE_PRODUCT_ADMIN, UPDATE_PRODUCT_STATUS_ADMIN } from "#/apollo/mutation";
import {
  ProductType,
  ProductStatus,
  ProductSortingItem,
  SortState,
  ProductsInfoType,
  TableColumn,
} from "#/utils/types";
import ProductSearchComponent from "#/pages/Admin/SearchProduct";
import Modal from "#/common/Modal";
import UpdateProductForm from "#/common/UpdateProductForm";
import { sortObjectsByKey } from "#/utils/sort";
import { useSearchParams } from "react-router-dom";
import { Select, Option, Button, Drawer, Typography, IconButton } from "@material-tailwind/react";

import CircularPagination from "#/common/Pagenation";
import { CategoryTree } from "./CategoryManagement";
import CreateProductForm from "#/common/CreateProductForm";
import ConfirmationDialog from "#/common/ConfirmationDialog";

export const PAGE_SIZE = 10;

const init_product = {
  name: "",
  desc: "",
  is_deleted: false,
  status: "OUT_OF_STOCK",
  main_image_path: "",
  desc_images_path: "",
  category_name: "",
  store_name: "",
};

const ProductInfoTab = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleOpenDrawer = () => setOpenDrawer(true);
  const handleCloseDrawer = () => setOpenDrawer(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [field, setField] = useState<string>(searchParams.get("field") || "");

  const [pageStatus, setPageStatus] = useState(Number(searchParams.get("pageStatus")) || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clickedProduct, setClickedProduct] = useState(init_product);
  const [willDelete, setWillDelete] = useState<ProductType[]>([]);
  const [data, setData] = useState<ProductsInfoType>({
    products: [],
    pageInfo: {
      currentPage: 1,
      pageSize: 1,
      totalCount: 1,
      totalPages: 1,
    },
  });
  const [sortState, setSortState] = useState<SortState<ProductSortingItem>>({
    name: "none",
    price: "none",
    sale: "none",
    count: "none",
    status: "none",
  });

  const {
    data: allData,
    loading,
    error,
    refetch,
  } = useQuery(PRODUCTS_INFO_ADMIN, {
    variables: {
      page: pageStatus,
      pageSize: PAGE_SIZE,
    },
  });

  const [filteredProducts, { loading: filteredLoading, error: filteredError }] = useLazyQuery(
    PRODUCT_SEARCH_ADMIN,
    {
      variables: {
        page: pageStatus,
        pageSize: PAGE_SIZE,
      },
    }
  );

  const [updateState, { loading: updateStateLoading, error: updateStateError }] = useMutation(
    UPDATE_PRODUCT_STATUS_ADMIN,
    {
      variables: {
        page: pageStatus,
        pageSize: PAGE_SIZE,
      },
    }
  );

  const [deleteFc] = useMutation(DELETE_PRODUCT_ADMIN);

  const performSearch = useCallback(async () => {
    const filterVariables = {
      searchTerm,
      field,
      page: pageStatus,
      pageSize: PAGE_SIZE,
    };
    const { data: productsData } = await filteredProducts({
      variables: filterVariables,
    });
    if (productsData?.searchProducts) {
      setData(productsData.searchProducts);
    }
  }, [filteredProducts, field, searchTerm, pageStatus]);

  useEffect(() => {
    if (searchParams.get("searchOpen") === "true") {
      performSearch();
    } else {
      refetch();
    }
  }, [searchParams, performSearch, refetch, pageStatus]);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  const openModal = (product: ProductType) => {
    if (product) {
      setIsModalOpen(true);
      setClickedProduct((prev) => ({ ...prev, ...product }));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setClickedProduct(init_product);
  };

  const handleRowClick = (product: ProductType) => {
    openModal(product);
  };

  const handleSelectionChange = (selectedProducts: ProductType[]) => {
    setWillDelete(selectedProducts);
  };

  const handleSortClick = (key: keyof ProductSortingItem) => {
    setSortState((prevState) => {
      const newSortOrder =
        prevState[key] === "none" ? "asc" : prevState[key] === "asc" ? "desc" : "none";
      const newSortState = { ...prevState, [key]: newSortOrder };

      let sortedData = [...data.products];
      if (newSortOrder !== "none") {
        sortedData = sortObjectsByKey(sortedData, key, newSortOrder === "asc");
      } else {
        sortedData = allData?.getAllProducts?.products || [];
      }

      setData((prev) => ({
        ...prev,
        products: sortedData,
      }));
      return newSortState;
    });
  };

  const handleSearchProducts = () => {
    const newSearchParams = new URLSearchParams();
    console.log(searchTerm);
    newSearchParams.set("searchTerm", searchTerm);
    newSearchParams.set("searchField", field === "all" ? "" : field);
    newSearchParams.set("searchOpen", "true");
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
    newSearchParams.set("searchOpen", "false");
    setSearchParams(newSearchParams);
    setData(allData.getAllProducts);
  };

  const handleUpdateState = async (v: ProductStatus, id: string) => {
    try {
      await updateState({
        variables: {
          id: id,
          status: v as ProductStatus,
        },
        onCompleted: async () => {
          await refetch();
        },
      });
    } catch (error) {
      throw new Error(`제품의 상태를 업데이트하는데 실패했습니다.${error}`);
    }
  };

  const handleDeleteProducts = async (productArr: ProductType[]) => {
    try {
      setIsDeleteModalOpen((prev) => !prev);
      productArr.forEach(async (p) => {
        await deleteFc({
          variables: {
            id: p.id,
          },
          onCompleted: async () => {
            await refetch();
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

  const columns: TableColumn<ProductType, ProductSortingItem>[] = [
    { header: "Name", key: "name", sort: sortState.name as keyof ProductSortingItem },
    { header: "정가", key: "price", sort: sortState.price as keyof ProductSortingItem },
    { header: "판매가", key: "sale", sort: sortState.sale as keyof ProductSortingItem },
    { header: "재고", key: "count", sort: sortState.count as keyof ProductSortingItem },
    {
      header: "상태",
      key: "status",
      render: (product) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            variant="outlined"
            label="상태"
            onChange={(v) => handleUpdateState(v as ProductStatus, product.id)}
            value={product.status}
          >
            <Option value={ProductStatus.AVAILABLE}>판매가능</Option>
            <Option value={ProductStatus.TEMPORARILY_OUT_OF_STOCK}>일시품절</Option>
            <Option value={ProductStatus.OUT_OF_STOCK}>품절</Option>
            <Option value={ProductStatus.DISCONTINUED}>단종</Option>
            <Option value={ProductStatus.PROHIBITION_ON_SALE}>판매금지</Option>
          </Select>
        </div>
      ),
      sort: sortState.status as keyof ProductSortingItem,
    },
    {
      header: "삭제",
      key: "is_deleted",
      render: (is_deleted) => (
        <div>
          {!is_deleted && "삭제"}
          {is_deleted && "저장"}
        </div>
      ),
    },
    {
      header: "category",
      key: "category",
      render: (product) => <span>{product.category?.name}</span>,
    },
    { header: "Description", key: "desc" },
    { header: "판매처", key: "store_id" },
  ];

  const handleChangePage = (p: number) => {
    setPageStatus(p);
    searchParams.set("pageStatus", String(p));
    setSearchParams(searchParams);
  };

  if (loading || filteredLoading || updateStateLoading) return <p>Loading...</p>;
  if (error || filteredError || updateStateError)
    return <p>Error: {error?.message || filteredError?.message}</p>;

  return (
    <div className="p-10">
      <Drawer open={openDrawer} onClose={handleCloseDrawer} className="p-4" size={800}>
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
      <CreateProductModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
      <UpdateProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={clickedProduct as unknown as ProductType}
      />
      <ConfirmationDialog
        isOpen={isDeleteModalOpen}
        message="선택한 모든 제품을 삭제하시겠습니까??"
        onConfirm={() => handleDeleteProducts(willDelete)}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      <ProductSearchComponent
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        field={field || ""}
        onFieldChange={setField}
        onSearch={handleSearchProducts}
        onReset={handleResetSearch}
      />
      <div className="w-full flex justify-end pt-10 -mb-8">
        <Button variant="outlined" onClick={handleOpenDrawer} className="mr-2">
          카테고리 관리
        </Button>
        <Button variant="outlined" onClick={openCreateModal} className="mr-2">
          제품생성
        </Button>
        <Button variant="outlined" onClick={openDeleteModal} disabled={willDelete.length === 0}>
          제품삭제
        </Button>
      </div>
      <Table<ProductType, ProductSortingItem>
        title="Product List"
        data={data.products}
        sortState={sortState}
        columns={columns}
        onSortClick={handleSortClick}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
      />
      <div className="w-full flex justify-center content-center">
        <CircularPagination
          currentPage={pageStatus}
          totalPages={data?.pageInfo?.totalPages || 1}
          onPageChange={handleChangePage}
        />
      </div>
    </div>
  );
};

interface UpdateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductType;
}

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateProductModal: React.FC<UpdateProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  return (
    <Modal isOpen={isOpen} title="제품 정보 수정" onClose={onClose}>
      <UpdateProductForm product={product} onClose={onClose} />
    </Modal>
  );
};
export const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} title="제품 생성" onClose={onClose}>
      <CreateProductForm onClose={onClose} />
    </Modal>
  );
};

export default ProductInfoTab;
