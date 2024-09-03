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

import { useMutation } from "@apollo/client";
import { cn } from "#/utils/utils";
import DetermineInput from "#/common/DetermineInput";
import DetermineTextarea from "#/common/DetermineTextarea";
import SelectBox from "#/common/SelectBox";
// import { formatNumber } from "#/utils/formatter";
import { useState, useEffect } from "react";
import {
  validateProductName,
  validateProductDesc,
  validateAndFormatPrice,
} from "#/utils/validateProduct";
import ImageUpload from "#/common/ImageUploadFile";
import { SelectCategoryTree } from "#/pages/Admin/SelectCategory";
import { PRODUCTS_INFO_ADMIN } from "#/apollo/query";
const init_product = {
  name: "",
  desc: "",
  price: 0,
  sale: 0,
  count: 0,
  is_deleted: false,
  status: "OUT_OF_STOCK" as ProductStatus,
  main_image_path: "",
  desc_images_path: "",
  category: {
    id: 0,
    name: "",
  },
  store_id: "0eeafcc8-4adb-4a8b-b274-50fe66309d80",
};
const CreateProductForm = ({ onClose }: { onClose: () => void }) => {
  const [formState, setFormState] = useState<CreateProductStateType>(init_product);
  const [createFc, { data: createProductData, loading, error }] = useMutation(
    CREATE_PRODUCT_ADMIN,
    {
      refetchQueries: [{ query: PRODUCTS_INFO_ADMIN }],
      awaitRefetchQueries: true,
    }
  );

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
      label: "수량",
      placeholder: "숫자만 입력해 주세요.",
      wrongMessage: "수량을 다시 입력해 주세요.",
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
  ];

  useEffect(() => {
    if (createProductData) {
      console.log(createProductData);
    }
  }, [createProductData]);

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

  useEffect(() => {
    console.log(formState.status);
  }, [formState]);

  const handleMainImageSelect = (imagePaths: string[]) => {
    console.log("Selected image paths:", imagePaths);
    handleInputChange("main_image_path", imagePaths.toString());
  };

  const handleDescImageSelect = (imagePaths: string[]) => {
    console.log("Selected image paths:", imagePaths);
    handleInputChange("desc_images_path", `[${imagePaths.toString()}]`);
  };

  const handleSelect = (category: CategoryType) => {
    setFormState((prevState) => ({
      ...prevState,
      category: { id: category.id, name: category.name },
    }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
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

    if (validationResults.some(Boolean)) {
      try {
        await createFc({
          variables: {
            name: formState?.name,
            desc: formState?.desc,
            status: formState?.status,
            is_deleted: formState.is_deleted,
            price: Number(formState?.price),
            sale: Number(formState?.sale),
            count: Number(formState?.count),
            main_image_path: formState?.main_image_path,
            desc_images_path: formState?.desc_images_path,
            category_id: Number(formState?.category.id),
            store_id: formState.store_id,
          },
        });
        onClose();
      } catch (error) {
        console.error("Error during update: ", error);
      }
    } else {
      alert("형식을 다시 확인해주세요.");
    }
  };

  return (
    <div className="h-[80vh]">
      <form onSubmit={handleUpdate}>
        <div className="grid gap-6 mb-6 md:grid-cols-1 min-w-96 max-w-full">
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
          <ImageUpload
            onImageSelect={handleMainImageSelect}
            title="제품 대표 사진 (필수)"
            multiple={false}
          />
          <ImageUpload
            onImageSelect={handleDescImageSelect}
            title="제품 추가 사진"
            multiple={true}
          />
          <SelectCategoryTree parentState={formState} onSelect={handleSelect} />
        </div>

        <button
          type="submit"
          className={cn(
            `bg-blue-500 text-white border text-sm rounded-lg block min-w-20 w-full p-2.5 mb-5`
          )}
        >
          생성
        </button>
      </form>
      {loading && <p>생성중...</p>}
      {error && <p style={{ color: "red" }}>An error occurred: {error.message}</p>}
      <div className="h-10" />
    </div>
  );
};

export default CreateProductForm;