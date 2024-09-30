import { ProductType, ReviewConnectionType, UserPermissions } from "#/utils/types";
import { useQuery } from "@apollo/client";
import { PAGINATED_REVIEWS } from "#/apollo/query";

import CircularPagination from "#/common/Pagenation";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "#/utils/auth";
import NotificationDialog from "#/common/NotificationDialog";
import CreateReview from "#/pages/Home/CreateReview";
import RenderReviews from "#/pages/Home/RenderReviews";
import { useLocation, useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Spinner } from "@material-tailwind/react";
const PAGE_SIZE = 5;
const ProductReview = ({ product }: { product: ProductType }) => {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [id, setId] = useState<string>("");
  const [data, setData] = useState<ReviewConnectionType>({
    reviews: [],
    pageInfo: {
      currentPage: 1,
      pageSize: 1,
      totalCount: 1,
      totalPages: 1,
    },
  });
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [pageStatus, setPageStatus] = useState(Number(searchParams.get("pageStatus")) || 1);
  const [reviewKey, setReviewKey] = useState(0); // New state for forcing re-render
  const handleChangePage = (p: number) => {
    setPageStatus(p);
    searchParams.set("tabState", "review");
    searchParams.set("pageStatus", String(p));
    setSearchParams(searchParams);
  };
  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, [location]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      setId(decodedToken.userId);
      if (decodedToken.userRole === UserPermissions.ADMIN) {
        setIsAdmin(true);
      }
    }
  }, [token]);

  const variables = {
    page: pageStatus,
    pageSize: PAGE_SIZE,
    productId: product?.id,
    isDeleted: isAdmin ? undefined : false,
  };

  const {
    data: reviewData,
    loading,
    error,
    refetch,
  } = useQuery(PAGINATED_REVIEWS, {
    variables,
  });

  useEffect(() => {
    if (error) setIsErrorOpen(true);
  }, [error]);

  useEffect(() => {
    if (reviewData?.paginatedReviews) {
      setData(reviewData.paginatedReviews);
    }
  }, [reviewData]);
  const handleReviewCreated = useCallback(() => {
    refetch();
    setReviewKey((prevKey) => prevKey + 1); // Force re-render of CreateReview
  }, [refetch]);
  return (
    <div>
      <NotificationDialog
        isOpen={isErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다.\n${error?.message}`}
        onClose={() => setIsErrorOpen(false)}
      />
      {/* <div>"{product?.name}" 상품 생생 리뷰</div> */}
      {loading && <Spinner />}
      <div>
        <CreateReview
          title="리뷰달기"
          key={reviewKey}
          userId={id}
          productId={product?.id}
          variables={variables}
          onSubmit={handleReviewCreated}
        />
      </div>
      {data?.reviews && data.reviews.length > 0 && <div>총 {data.reviews.length}개</div>}
      {data?.reviews && (
        <>
          <div>
            <RenderReviews reviewList={data?.reviews} variables={variables} />
          </div>
          <div className="w-full flex justify-center content-center">
            <CircularPagination
              currentPage={pageStatus}
              totalPages={data?.pageInfo?.totalPages || 1}
              onPageChange={handleChangePage}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductReview;
