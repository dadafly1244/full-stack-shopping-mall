import { useEffect, useState, useCallback, SetStateAction } from "react";
import Table from "#/common/Table";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { PRODUCT_SEARCH_ADMIN, PRODUCTS_INFO_ADMIN, PRODUCT_DETAILS_ADMIN } from "#/apollo/query";
import {
  ProductType,
  ProductStatus,
  ProductSearchFilters,
  ProductCheckboxStates,
  ProductSortingItem,
  SortState,
  ProductsInfoType,
  TableColumn,
} from "#/utils/types";
import ProductSearchComponent from "#/pages/Admin/ProductSearchComponent";
import Modal from "#/common/Modal";
import UpdateProductForm from "#/common/UpdateProductForm";
import { sortObjectsByKey } from "#/utils/sort";
import { useSearchParams } from "react-router-dom";
import { Select, Option } from "@material-tailwind/react";

import CircularPagination from "#/common/Pagenation";
import { CategoryTree } from "./CategoryManagement";

const PAGE_SIZE = 20;

const init_product = {
  name: "",
  desc: "",
  price: 0,
  sale: 0,
  count: 0,
  is_deleted: false,
  status: "OUT_OF_STOCK",
  main_image_path: "",
  desc_images_path: "",
  category_name: "",
  store_name: "",
  // store_id: "0eeafcc8-4adb-4a8b-b274-50fe66309d80",
};

const initialFilters: ProductSearchFilters = {
  name: "",
  desc: "",
  price: 0,
  sale: 0,
  count: 0,
  is_deleted: null,
  status: "OUT_OF_STOCK" as ProductStatus,
  category_name: "",
  store_name: "",
};

const initialCheckboxes: ProductCheckboxStates = {
  name: false,
  desc: false,
  price: false,
  sale: false,
  count: false,
  is_deleted: false,
  status: false,
  category_name: false,
  store_name: false,
};

const ProductInfoTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localFilters, setLocalFilters] = useState<ProductSearchFilters>({
    name: searchParams.get("filter_name") || "",
    desc: searchParams.get("filter_desc") || "",
    price: Number(searchParams.get("filter_price")) || 0,
    sale: Number(searchParams.get("filter_sale")) || 0,
    count: Number(searchParams.get("filter_count")) || 0,
    is_deleted: Boolean(searchParams.get("filter_is_deleted")) || null,
    status: (searchParams.get("filter_status") as ProductStatus) || "AVAILABLE",
    category_name: searchParams.get("filter_category_name") || "",
    store_name: searchParams.get("filter_store_name") || "",
  });
  const [localCheckboxes, setLocalCheckboxes] = useState<ProductCheckboxStates>({
    name: searchParams.get("check_name") === "true",
    desc: searchParams.get("check_desc") === "true",
    price: searchParams.get("check_price") === "true",
    sale: searchParams.get("check_sale") === "true",
    count: searchParams.get("check_count") === "true",
    is_deleted: searchParams.get("check_is_deleted") === "true",
    status: searchParams.get("check_status") === "true",
    category_name: searchParams.get("check_category_name") === "true",
    store_name: searchParams.get("check_store_name") === "true",
  });

  const [shouldSearch, setShouldSearch] = useState(searchParams.get("searchOpen") === "true");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [pageStatus, setPageStatus] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedProduct, setClickedProduct] = useState(init_product);
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
  const [productStatusState, setProductStatusState] = useState<ProductStatus>(
    ProductStatus.OUT_OF_STOCK
  );

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

  const performSearch = useCallback(async () => {
    const filterVariables = Object.fromEntries(
      Object.entries(localFilters).filter(
        ([key, value]) => localCheckboxes[key as keyof ProductCheckboxStates] && value !== ""
      )
    );
    const { data: productsData } = await filteredProducts({
      variables: filterVariables,
    });
    if (productsData?.searchProducts) {
      setData(productsData.searchProducts);
    }
  }, [filteredProducts, localFilters, localCheckboxes]);

  useEffect(() => {
    console.log("동작1");
    console.log("동작1-1");
    if (isInitialLoad) {
      console.log("동작2");
      if (searchParams.get("searchOpen") === "true") {
        performSearch();
      } else if (allData?.getAllProducts) {
        setData(allData.getAllProducts);
      }
      setIsInitialLoad(false);
    } else if (shouldSearch) {
      console.log("동작3");
      performSearch();
      console.log("동작4");
      setShouldSearch(false);
    }
  }, [isInitialLoad, shouldSearch, searchParams, allData, performSearch]);

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
    console.log("Clicked product:", product);
    openModal(product);
  };

  const handleSelectionChange = (selectedUsers: ProductType[]) => {
    console.log("Selected users:", selectedUsers);
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

  const handleSearchUser = () => {
    const newSearchParams = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(`filter_${key}`, value);
      }
    });
    Object.entries(localCheckboxes).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(`check_${key}`, "true");
      }
    });
    newSearchParams.set("searchOpen", "true");
    setSearchParams(newSearchParams);
    setShouldSearch(true);
    console.log(data);
  };

  useEffect(() => {
    if (allData?.getAllProducts) {
      setData(allData.getAllProducts);
    }
  }, [allData?.getAllProducts]);

  const handleCloseSearch = async () => {
    setSearchParams(new URLSearchParams());
    setLocalFilters(initialFilters);
    setLocalCheckboxes(initialCheckboxes);
    if (allData?.getAllProducts) {
      setData(allData.getAllProducts);
    }
    if (!allData.getAllProducts) {
      await refetch();
      setData(allData?.getAllProducts);
    }
  };

  const handleResetSearch = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("searchOpen", "true");
    setSearchParams(newSearchParams);
    setLocalFilters(initialFilters);
    setLocalCheckboxes(initialCheckboxes);
    if (allData?.getAllProducts) {
      setData(allData.getAllProducts);
    }
  };

  const columns: TableColumn<ProductType, ProductSortingItem>[] = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name", sort: sortState.name as keyof ProductSortingItem },
    { header: "Description", key: "desc" },
    { header: "정가", key: "price", sort: sortState.price as keyof ProductSortingItem },
    { header: "판매가", key: "sale", sort: sortState.sale as keyof ProductSortingItem },
    { header: "재고", key: "count", sort: sortState.count as keyof ProductSortingItem },
    {
      header: "상태",
      key: "status",
      render: () => (
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            variant="outlined"
            label="상태"
            onChange={(v) => {
              setProductStatusState(v as ProductStatus);
            }}
            value={productStatusState}
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
    { header: "삭제된제품", key: "is_deleted" },
    { header: "카테고리", key: "category_id" },
    { header: "상점", key: "store_id" },
  ];

  if (loading || filteredLoading) return <p>Loading...</p>;
  if (error || filteredError) return <p>Error: {error?.message || filteredError?.message}</p>;

  return (
    <div>
      <UpdateProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={clickedProduct as unknown as ProductType}
      />
      <CategoryTree />
      <ProductSearchComponent
        filters={localFilters}
        checkboxes={localCheckboxes}
        onClickSearch={handleSearchUser}
        setLocalFilters={setLocalFilters}
        onCloseSearch={handleCloseSearch}
        setLocalCheckboxes={setLocalCheckboxes}
        onResetSearch={handleResetSearch}
      />
      <Table<ProductType, ProductSortingItem>
        title="Product List"
        data={data?.products}
        sortState={sortState}
        columns={columns}
        onSortClick={handleSortClick}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
      />
      <CircularPagination
        currentPage={pageStatus}
        totalPages={data?.pageInfo?.totalPages || 1}
        onPageChange={(p) => setPageStatus(p)}
      />
    </div>
  );
};

interface UpdateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductType;
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

export default ProductInfoTab;
