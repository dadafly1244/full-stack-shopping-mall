import { useEffect, useState } from "react";
import { CREATE_PRODUCT_ADMIN } from "#/apollo/mutation";
import {
  ProductType,
  UpdateProductFormItem,
  CustomProductDetermineInputProps,
  CustomProductSelectProps,
  CustomProductDetermineTextareaProps,
  CategoryType,
  CreateProductStateType,
  ProductStatus,
} from "#/utils/types";
import Breadcrumb from "#/common/Breadcrumb";
import { useMutation } from "@apollo/client";
import DetermineInput from "#/common/DetermineInput";
import DetermineTextarea from "#/common/DetermineTextarea";
import SelectBox from "#/common/SelectBox";
import {
  validateProductName,
  validateProductDesc,
  validateAndFormatPrice,
} from "#/utils/validateProduct";
import ImageUpload from "#/common/ImageUploadFile";
import { SelectCategoryTree } from "#/pages/Admin/SelectCategory";
import { Button, Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import NotificationDialog from "#/common/NotificationDialog";

const init_product = {
  name: "",
  desc: "",
  price: 0,
  sale: 0,
  count: 0,
  is_deleted: false,
  status: "AVAILABLE" as ProductStatus,
  main_image_path: null,
  desc_images_path: [],
  category: {
    id: 0,
    name: "",
  },
  store_id: "9f0d3c81-9f15-4c9e-84f5-5fd44085494c",
};
const CreateProduct = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<CreateProductStateType>(init_product);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [descImages, setDescImages] = useState<File[]>([]);

  const [createFc, { loading, error }] = useMutation(CREATE_PRODUCT_ADMIN);

  const updateForm: UpdateProductFormItem[] = [
    {
      type: "determineInput",
      key: "name",
      label: "이름",
      placeholder: "알파벳, 한글, 숫자, 특수문자( _밑줄, .점, ,쉼표)로 2~100자를 입력해주세요.",
      wrongMessage: (name: string): string => validateProductName(name).message,
      rightMessage: (name: string): string => validateProductName(name).message,
      isRight: (name: string): boolean => validateProductName(name).isValid,
      isRequired: true,
    },

    {
      type: "determineInput",
      key: "price",
      label: "정가",
      placeholder: "숫자만 입력해 주세요.",
      wrongMessage: (price: string | number): string => validateAndFormatPrice(price).message,
      rightMessage: (price: string | number): string => validateAndFormatPrice(price).message,
      isRight: (price: string | number): boolean => validateAndFormatPrice(price).isValid,
      isRequired: true,
    },
    {
      type: "determineInput",
      key: "sale",
      label: "판매가",
      placeholder: "숫자만 입력해 주세요.",
      wrongMessage: (price: string | number): string => validateAndFormatPrice(price).message,
      rightMessage: (price: string | number): string => validateAndFormatPrice(price).message,
      isRight: (price: string | number): boolean => validateAndFormatPrice(price).isValid,
    },
    {
      type: "determineInput",
      key: "count",
      label: "재고",
      placeholder: "숫자만 입력해 주세요.",
      wrongMessage: "재고을 다시 입력해 주세요.",
      isRight: (count: number | string) => {
        if (typeof count === "string") {
          const nan = isNaN(Number(count));
          if (nan) return false;
        }
        return true;
      },
      isRequired: true,
    },
    {
      type: "selectInput",
      key: "status",
      label: "판매상태 (필수)",
      defaultValue: "OUT_OF_STOCK",
      options: [
        { value: "AVAILABLE", label: "판매가능" },
        { value: "TEMPORARILY_OUT_OF_STOCK", label: "일시품절" },
        { value: "OUT_OF_STOCK", label: "품절" },
        { value: "DISCONTINUED", label: "단품" },
        { value: "PROHIBITION_ON_SALE", label: "판매금지" },
      ],
    },
    {
      type: "determineTextarea",
      key: "desc",
      label: "상품설명",
      placeholder: "상품에 대한 자세한 설명을 입력해주세요.",
      wrongMessage: (desc: string): string => validateProductDesc(desc).message,
      rightMessage: (desc: string): string => validateProductDesc(desc).message,
      isRight: (desc: string): boolean => validateProductDesc(desc).isValid,
      rows: 4,
      maxLength: 1000,
      onChange: (value: string) => {
        validateProductDesc(value).sanitizedValue;
        handleInputChange("desc", validateProductDesc(value).sanitizedValue);
        // 예: setProductDesc(result.sanitizedValue);
      },
    },
  ];

  const isDetermineInput = (
    item: UpdateProductFormItem
  ): item is CustomProductDetermineInputProps => {
    return item.type === "determineInput";
  };

  type valueType = string | number | ProductStatus;

  const handleInputChange = (key: keyof ProductType, value: valueType) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMainImageSelect = (files: File[]) => {
    if (files.length > 0) {
      setMainImage(files[0]);
    }
  };

  const handleDescImageSelect = (files: File[]) => {
    setDescImages(files);
  };
  const handleSelect = (category: CategoryType) => {
    setFormState((prevState) => ({
      ...prevState,
      category: { id: category.id, name: category.name },
    }));
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 모든 필드 검증
    const validationResults = await Promise.all(
      Object.keys(formState).map(async (key) => {
        const typedKey = key as keyof CreateProductStateType;
        const value = formState[typedKey];

        const field = updateForm.find((f) => f.key === typedKey);
        if (field && isDetermineInput(field)) {
          return field.isRight(value as string);
        }
        return true;
      })
    );

    if (validationResults.every(Boolean)) {
      try {
        const variables = {
          name: formState?.name,
          desc: formState?.desc,
          status: formState?.status,
          is_deleted: formState.is_deleted,
          price: Number(formState?.price),
          sale: Number(formState?.sale),
          count: Number(formState?.count),
          category_id: Number(formState?.category.id),
          store_id: formState.store_id,
          main_image_path: mainImage,
          desc_images_path: descImages,
        };

        await createFc({
          variables,
          onCompleted: () => {
            navigate("/admin/product-info");
          },
        });
      } catch (error) {
        console.error("Error during update: ", error);
      }
    } else {
      alert("형식을 다시 확인해주세요.");
    }
  };

  const [isErrorOpen, setIsErrorOpen] = useState(false);

  useEffect(() => {
    if (error) setIsErrorOpen(true);
  }, [error]);
  return (
    <div className="pt-5 pb-10">
      <Breadcrumb />
      <form className=" pt-5 flex flex-col justify-center content-center" onSubmit={handleCreate}>
        <div className="flex justify-center w-full mx-auto">
          <div className="w-1/2 px-6">
            {updateForm.map((item) => {
              if (item.type === "determineInput") {
                const determineItem = item as CustomProductDetermineInputProps;
                return (
                  <DetermineInput
                    key={determineItem.key}
                    label={determineItem.label}
                    placeholder={determineItem.placeholder}
                    wrongMessage={determineItem.wrongMessage}
                    rightMessage={determineItem.rightMessage}
                    isRight={determineItem.isRight}
                    isRequired={determineItem.isRequired}
                    className={determineItem.className}
                    button={determineItem.button}
                    buttonClick={determineItem.buttonClick}
                    onChange={(value) => handleInputChange(item.key, value)}
                  />
                );
              } else if (item.type === "selectInput") {
                const selectItem = item as CustomProductSelectProps;
                return (
                  <SelectBox
                    key={selectItem.key}
                    label={selectItem.label}
                    defaultValue={selectItem.key}
                    options={selectItem.options}
                    onChange={(v) => handleInputChange(selectItem.key, v)}
                  />
                );
              } else if (item.type === "determineTextarea") {
                const textareaItem = item as CustomProductDetermineTextareaProps;
                return (
                  <DetermineTextarea
                    {...textareaItem}
                    key={textareaItem.key}
                    onChange={(v) => handleInputChange("desc", v)}
                  />
                );
              }
              return null;
            })}
            <SelectCategoryTree parentState={formState} onSelect={handleSelect} />
          </div>
          <div className="w-1/2 px-6">
            <ImageUpload
              onImageSelect={handleMainImageSelect}
              title="제품 대표 사진 (필수)"
              multiple={false}
            />
            <ImageUpload
              onImageSelect={handleDescImageSelect}
              title="제품 설명란 첨부 사진"
              multiple={true}
            />
          </div>
        </div>
        <div className="flex  justify-end">
          <Button variant="filled" className="mr-4 px-10" type="submit">
            제품 생성
          </Button>
        </div>
      </form>
      {loading && <Spinner className="!absolute flex justify-center content-center" />}
      {error && (
        <NotificationDialog
          isOpen={isErrorOpen}
          title="ERROR!!"
          message={`에러가 발생했습니다.\n${error?.message}`}
          onClose={() => setIsErrorOpen(false)}
        />
      )}
    </div>
  );
};
export default CreateProduct;
