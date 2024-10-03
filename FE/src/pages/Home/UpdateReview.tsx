import { USER_UPDATE_REVIEW } from "#/apollo/mutation";
import { PAGINATED_REVIEWS } from "#/apollo/query";
import DetermineTextarea from "#/common/DetermineTextarea";
import HalfStarRating from "#/common/HalfStarRating";
import NotificationDialog from "#/common/NotificationDialog";
import ImageUpload from "#/common/ReviewImageUpload";
import { ProductType, ReviewType } from "#/utils/types";
import { cn } from "#/utils/utils";
import { validateReview } from "#/utils/validateProduct";
import { useMutation } from "@apollo/client";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";

interface updateReviewArgsType {
  id: string;
  title: string;
  desc: string;
  score: number;
  images_path?: File | string;
  user_id: string;
}
interface getReviewVariablesType {
  page: number;
  pageSize: number;
  productId: string;
  isDeleted: boolean | undefined;
}
const UpdateReview = ({
  title = "리뷰달기",
  reviewData,
  variables,
  isChild = false,
  onClose,
}: {
  title?: string;
  reviewData: ReviewType;
  variables: getReviewVariablesType;
  onClose?: () => void;
  isChild?: boolean;
}) => {
  const [newReview, setNewReview] = useState<ReviewType>(reviewData);
  const [mainImage, setMainImage] = useState<File>();
  const [score, setScore] = useState<number>(reviewData.score);
  const handleMainImageSelect = (file: File | undefined) => {
    if (file) {
      setMainImage(file);
    }
  };
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const [updateFc, { loading, error }] = useMutation(USER_UPDATE_REVIEW, {
    refetchQueries: [{ query: PAGINATED_REVIEWS, variables: variables }],
    awaitRefetchQueries: true,
  });
  useEffect(() => {
    if (error) setIsErrorOpen(true);
  }, [error]);

  const handleCreateReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (newReview?.desc) {
        if (newReview.desc.trim() === "") {
          alert("내용을 입력해주세요.");
          return;
        }
        if (!validateReview(newReview.desc).isValid) {
          alert(validateReview(newReview.desc).message);
          return;
        }
        const updateVariables: updateReviewArgsType = {
          id: newReview.id,
          title: `${newReview.desc.slice(0, 30)}...`,
          score,
          desc: newReview.desc,
          user_id: newReview.user_id,
        };
        if (mainImage) {
          updateVariables.images_path = mainImage;
        }

        await updateFc({ variables: updateVariables });
      }
      setMainImage(undefined);
      setNewReview(reviewData);
      onClose?.();
    } catch (error) {
      setNewReview(reviewData);
      setIsErrorOpen(true);
      console.error(error);
    }
  };

  const handleInputChange = (key: keyof ProductType, value: string) => {
    setNewReview((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleWrongMessage = (desc: string): string => validateReview(desc).message;
  const handleRightMessage = (desc: string): string => validateReview(desc).message;
  const handleIsRight = (desc: string): boolean => validateReview(desc).isValid;

  return (
    <div>
      <NotificationDialog
        isOpen={!newReview?.user_id}
        title="ERROR!!"
        message={`에러가 발생했습니다. 이전 댓글을 불러올 수 없습니다.`}
        onClose={() => onClose?.()}
      />
      <NotificationDialog
        isOpen={isErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다.\n${error?.message}`}
        onClose={() => {
          setIsErrorOpen(false);
          onClose?.();
        }}
      />
      <form className=" flex items-start gap-2" onSubmit={handleCreateReview}>
        <div className="w-4/5 relative">
          {!isChild && (
            <div className="absolute  right-2 top-1">
              <HalfStarRating value={score} onChange={(value) => setScore(value)} />
            </div>
          )}
          <DetermineTextarea
            label={title as string}
            value={newReview.desc}
            placeholder="상품에 대한 후기를 남겨주세요.(100자 이상)"
            wrongMessage={handleWrongMessage}
            rightMessage={handleRightMessage}
            isRight={handleIsRight}
            rows={6}
            maxLength={1000}
            onChange={(value: string) => handleInputChange("desc", value)}
            className={cn(!isChild ? "!pr-28" : "")}
          />
          {!isChild && (
            <div className="absolute right-2 top-10">
              <ImageUpload
                onImageSelect={handleMainImageSelect}
                rawUrls={[newReview.images_path as string]}
                multiple={false}
              />
            </div>
          )}
        </div>
        <div className="w-1/5 text-lg flex flex-col gap-2 mt-14">
          <Button
            variant="outlined"
            className="w-1/2 "
            type="button"
            onClick={() => onClose?.()}
            loading={loading}
          >
            취소
          </Button>
          <Button className="w-1/2 " type="submit" loading={loading}>
            수정
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateReview;
