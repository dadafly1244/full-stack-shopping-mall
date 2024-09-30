import { ReviewType, UserPermissions } from "#/utils/types";
import HalfStarRating from "#/common/HalfStarRating";
import { useFormatDate } from "#/hooks/useFormatDate";
import { cn } from "#/utils/utils";
import CreateReview from "#/pages/Home/CreateReview";
import UpdateReview from "#/pages/Home/UpdateReview";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import ProductImage from "#/common/ProductImage";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "#/utils/auth";
import { useMutation } from "@apollo/client";
import { ADMIN_MANAGE_REVIEW } from "#/apollo/mutation";
import { PAGINATED_REVIEWS } from "#/apollo/query";
interface getReviewVariablesType {
  page: number;
  pageSize: number;
  productId: string;
  isDeleted: boolean | undefined;
}

const ChildReview = ({
  reviewData,
  isDeleted,
  variables,
}: {
  reviewData: ReviewType;
  isDeleted: undefined | boolean;
  variables: getReviewVariablesType;
}) => {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentId, setCurrentId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteFc, { loading, error }] = useMutation(ADMIN_MANAGE_REVIEW, {
    refetchQueries: [{ query: PAGINATED_REVIEWS, variables: variables }],
    awaitRefetchQueries: true,
  });

  const handleDelete = async () => {
    await deleteFc({
      variables: {
        id: reviewData.id,
        is_deleted: !isDeleted,
      },
    });
  };
  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, [location]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      setCurrentId(decodedToken.userId);
      if (decodedToken.userRole === UserPermissions.ADMIN) {
        setAdminId(decodedToken.userId);
      } else {
        setAdminId("");
      }
    } else {
      setCurrentId("");
    }
  }, [token]);

  const updateDate = useFormatDate({ date: reviewData.updated_at });

  const handleEditOpen = () => {
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
  };
  return (
    <div className="ml-20 relative">
      <div className="absolute top-4 -left-5">
        <svg
          className="w-5 h-5 rotate-180 "
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M205 34.8c11.5 5.1 19 16.6 19 29.2l0 64 112 0c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96l-96 0 0 64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" />
        </svg>
      </div>
      {openEdit ? (
        <UpdateReview
          reviewData={reviewData}
          title="답글달기"
          isChild
          variables={variables}
          onClose={handleEditClose}
        />
      ) : reviewData ? (
        <div className="flex p-3 w-full">
          <div className="flex flex-col w-1/5">
            <div>
              <span>{reviewData.user_id.slice(0, 6)}-****</span>님
            </div>
            <div>{updateDate}</div>
            <div className="flex gap-2 justify-start content-center">
              {currentId === reviewData.user_id && (
                <Button className="p-1" variant="outlined" onClick={handleEditOpen}>
                  수정
                </Button>
              )}
              {!!adminId && (
                <Button
                  onClick={handleDelete}
                  loading={loading}
                  onError={() => console.error(error)}
                  className="p-1"
                >
                  {isDeleted ? "삭제됨" : "삭제"}
                </Button>
              )}
            </div>
          </div>
          <div className="w-3/5 flex flex-col justify-between">
            <div className=" py-3 pl-3 pr-10 box-content break-words">{reviewData.desc}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Review = ({
  reviewData,
  isDeleted,
  variables,
}: {
  reviewData: ReviewType;
  isDeleted: undefined | boolean;
  variables: getReviewVariablesType;
}) => {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentId, setCurrentId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [openReview, setOpenReview] = useState(true);
  const [openReReview, setOpenReReview] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, [location]);

  const [deleteFc, { loading, error }] = useMutation(ADMIN_MANAGE_REVIEW, {
    refetchQueries: [{ query: PAGINATED_REVIEWS, variables: variables }],
    awaitRefetchQueries: true,
  });

  const handleDelete = async () => {
    await deleteFc({
      variables: {
        id: reviewData.id,
        is_deleted: !reviewData.is_deleted,
      },
    });
  };

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      setCurrentId(decodedToken.userId);
      if (decodedToken.userRole === UserPermissions.ADMIN) {
        setAdminId(decodedToken.userId);
      } else {
        setAdminId("");
      }
    } else {
      setCurrentId("");
    }
  }, [token]);

  const handleEditOpen = () => {
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleToggleReview = () => {
    setOpenReview((prev) => !prev);
  };

  const updateDate = useFormatDate({ date: reviewData.updated_at });

  const handleCloseReReview = () => {
    setOpenReReview(false);
  };

  const handleOpenReReview = () => {
    setOpenReReview(true);
  };

  return (
    <div className="w-full">
      {openEdit ? (
        <UpdateReview reviewData={reviewData} variables={variables} onClose={handleEditClose} />
      ) : reviewData ? (
        <div className="flex border-t border-solid border-gray-200 p-3 w-full">
          <div className="flex flex-col w-1/5">
            <div className="flex items-end">
              <span
                className={cn(
                  "font-bold text-sm",
                  reviewData.score > 3 ? "text-blue-gray-600 text-base" : "text-gray-300 text-sm"
                )}
              >
                {reviewData.score || 0}점
              </span>
              <HalfStarRating value={reviewData.score || 0} readOnly />
            </div>
            <div>
              <span>{reviewData.user_id.slice(0, 6)}-****</span>님
            </div>
            <div>{updateDate}</div>
            <div className="flex gap-2 justify-start content-center">
              {adminId ? (
                openReReview ? (
                  <Button variant="outlined" className="p-1" onClick={handleCloseReReview}>
                    닫기
                  </Button>
                ) : (
                  <Button variant="outlined" className="p-1" onClick={handleOpenReReview}>
                    답글
                  </Button>
                )
              ) : null}
              {currentId === reviewData.user_id && (
                <Button className="p-1" variant="outlined" onClick={handleEditOpen}>
                  수정
                </Button>
              )}
              {!!adminId && (
                <Button
                  onClick={handleDelete}
                  loading={loading}
                  onError={() => console.error(error)}
                  className="p-1"
                >
                  {isDeleted ? "삭제됨" : "삭제"}
                </Button>
              )}
            </div>
          </div>
          <div className="w-3/5 flex flex-col justify-between">
            <div className=" py-3 pl-3 pr-10 box-content break-words">
              {openReview ? reviewData.desc : reviewData.title}
            </div>
            <div className="w-full">
              <Button variant="outlined" className="px-5 py-1" onClick={handleToggleReview}>
                {openReview ? "접기" : "더보기"}
              </Button>
            </div>
          </div>
          <div className="w-1/5 flex flex-col justify-center items-center">
            <Button
              className="p-1 border border-solid border-gray-200"
              variant="outlined"
              disabled={!reviewData.images_path}
            >
              <ProductImage
                className="w-24"
                imagePath={reviewData.images_path ? reviewData.images_path : ""}
              />
            </Button>
          </div>
        </div>
      ) : null}
      {openReReview && (
        <div className="ml-16">
          <CreateReview
            title="답글달기"
            userId={currentId}
            productId={reviewData.product_id}
            parentReviewId={reviewData.id}
            variables={variables}
            onSubmit={handleCloseReReview}
          />
        </div>
      )}
      {reviewData?.childReviews && reviewData.childReviews.length > 0 && (
        <div>
          {reviewData.childReviews.map((r) => (
            <ChildReview
              key={r.id}
              reviewData={r}
              variables={variables}
              isDeleted={r?.is_deleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RenderReviews = ({
  reviewList,
  variables,
}: {
  reviewList: ReviewType[];
  variables: getReviewVariablesType;
}) => {
  return (
    <div>
      {reviewList && (
        <div>
          {reviewList.map((r) => (
            <Review key={r.id} reviewData={r} isDeleted={r?.is_deleted} variables={variables} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RenderReviews;
