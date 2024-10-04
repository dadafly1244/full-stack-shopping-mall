import { CREATE_REVIEW } from "#/apollo/mutation";
import { PAGINATED_REVIEWS } from "#/apollo/query";
import DetermineTextarea from "#/common/DetermineTextarea";
import HalfStarRating from "#/common/HalfStarRating";
import NotificationDialog from "#/common/NotificationDialog";
import ImageUpload from "#/common/ReviewImageUpload";
import { ProductType } from "#/utils/types";
import { cn } from "#/utils/utils";
import { validateReview } from "#/utils/validateProduct";
import { useMutation } from "@apollo/client";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";

interface createReviewArgsType {
  title: string;
  desc: string;
  score: number;
  images_path: string;
  product_id: string;
  parent_review_id: string;
  user_id: string;
}

const initReviewArgs: createReviewArgsType = {
  title: "",
  desc: "",
  score: 0,
  images_path: "",
  product_id: "",
  parent_review_id: "",
  user_id: "",
};

interface getReviewVariablesType {
  page: number;
  pageSize: number;
  productId: string;
  isDeleted: boolean | undefined;
}
const CreateReview = ({
  title,
  parentReviewId,
  productId,
  userId,
  variables,
  onSubmit,
}: {
  title?: string;
  parentReviewId?: string;
  productId: string;
  userId: string;
  variables: getReviewVariablesType;
  onSubmit?: () => void;
}) => {
  const [newReview, setNewReview] = useState<createReviewArgsType>({
    ...initReviewArgs,
    product_id: productId,
    user_id: userId,
  });
  const [mainImage, setMainImage] = useState<File>();
  const [score, setScore] = useState<number>(0);
  const handleMainImageSelect = (file: File | undefined) => {
    if (file) {
      setMainImage(file);
    }
  };

  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const [createFc, { loading, error }] = useMutation(CREATE_REVIEW, {
    refetchQueries: [{ query: PAGINATED_REVIEWS, variables: variables }],
    awaitRefetchQueries: true,
  });
  useEffect(() => {
    if (error) setIsErrorOpen(true);
  }, [error]);

  const handleCreateReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newReview.desc.trim() === "") {
      alert("내용을 입력해주세요.");
      return;
    }
    if (!validateReview(newReview.desc).isValid) {
      alert(validateReview(newReview.desc).message);
      return;
    }
    try {
      const newVariables = {
        ...newReview,
        score: score,
        user_id: userId,
        title: `${newReview?.desc.slice(0, 30)}...`,
        parent_review_id: parentReviewId,
        images_path: mainImage,
      };
      if (mainImage) {
        newVariables.images_path = mainImage;
      }

      await createFc({ variables: newVariables });

      setMainImage(undefined);
      setNewReview({
        ...initReviewArgs,
        product_id: productId,
        user_id: userId,
      });
      setScore(0);
      onSubmit?.();
    } catch (error) {
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

  if (!userId) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <div className="absolute left-16 -top-1">
            <HalfStarRating value={score} onChange={(value) => setScore(value)} disabled />
          </div>
          <DetermineTextarea
            label="리뷰달기"
            placeholder="로그인 후 리뷰를 남겨주세요."
            wrongMessage={handleWrongMessage}
            rightMessage={handleRightMessage}
            isRight={handleIsRight}
            rows={5}
            maxLength={1000}
            onChange={(value: string) => handleInputChange("desc", value)}
            className="!pr-28 mt-1"
            disabled={true}
          />
        </div>
        <div className="flex justify-start items-center">
          <Button className="text-lg py-11 px-10" disabled loading={loading}>
            등록
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <NotificationDialog
        isOpen={isErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다.\n${error?.message}`}
        onClose={() => setIsErrorOpen(false)}
      />
      <form className="flex px-16 items-start gap-2" onSubmit={handleCreateReview}>
        <div className="relative flex-grow">
          <div className="absolute left-16 -top-1">
            {!parentReviewId ? (
              <HalfStarRating value={score} onChange={(value) => setScore(value)} />
            ) : null}
          </div>
          <DetermineTextarea
            label={title as string}
            placeholder={
              !parentReviewId
                ? "상품에 대한 후기를 남겨주세요.(100자 이상)"
                : "고객님께 답글을 달아보세요."
            }
            wrongMessage={handleWrongMessage}
            rightMessage={handleRightMessage}
            isRight={handleIsRight}
            rows={5}
            maxLength={1000}
            onChange={(value: string) => handleInputChange("desc", value)}
            className={cn(!parentReviewId ? "!pr-28" : "")}
          />
          {!parentReviewId && (
            <div className="absolute right-2 top-9">
              <ImageUpload onImageSelect={handleMainImageSelect} multiple={false} />
            </div>
          )}
        </div>
        <div className="flex justify-start items-center mt-8">
          <Button className="text-lg py-11 px-10" type="submit" loading={loading}>
            등록
          </Button>
        </div>
      </form>
    </div>
  );
};
export default CreateReview;
