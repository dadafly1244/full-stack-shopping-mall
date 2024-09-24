import { useEffect, useState } from "react";
import { UPDATE_PRODUCT_ADMIN } from "#/apollo/mutation";
import {
  ProductType,
  UpdateProductFormItem,
  CustomProductDetermineInputProps,
  CustomProductDetermineTextareaProps,
  CategoryType,
  ProductStatus,
} from "#/utils/types";

import { useMutation, useQuery } from "@apollo/client";
import DetermineInput from "#/common/DetermineInput";
import DetermineTextarea from "#/common/DetermineTextarea";
import {
  validateProductName,
  validateProductDesc,
  validateAndFormatPrice,
} from "#/utils/validateProduct";
import ImageUpload from "#/common/ImageUploadFile";
import { SelectCategoryTree } from "#/pages/Admin/SelectCategory";
import { Button } from "@material-tailwind/react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { PRODUCT_DETAILS_ADMIN } from "#/apollo/query";
import Breadcrumb from "#/common/Breadcrumb";
type UpdateProductInput = {
  id: string;
  name: string;
  desc?: string;
  price: number;
  sale?: number;
  count: number;
  category_id: number;
  main_image_path?: File;
  desc_images_path?: File[];
};

const UpdateProduct = () => {
  const navigate = useNavigate();
  const param = useParams();

  const [formState, setFormState] = useState<ProductType | undefined>();
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [descImages, setDescImages] = useState<File[]>([]);

  const { data, loading } = useQuery(PRODUCT_DETAILS_ADMIN, {
    variables: {
      id: param?.productId,
    },
    fetchPolicy: "cache-and-network",
  });

  const [updateFc, { loading: updateLoading, error }] = useMutation(UPDATE_PRODUCT_ADMIN);

  useEffect(() => {
    if (data?.getProduct) {
      setFormState(data.getProduct);
    }
  }, [data]);

  useEffect(() => {
    console.log(descImages);
  }, [descImages]);

  const updateForm: UpdateProductFormItem[] = [
    {
      type: "determineInput",
      key: "name",
      label: "이름",
      placeholder: "알파벳, 한글, 숫자, 특수문자( _밑줄, .점, ,쉼표)로 2~100자를 입력해주세요.",
      wrongMessage: (name: string): string => validateProductName(name).message,
      rightMessage: (name: string): string => validateProductName(name).message,
      isRight: (name: string): boolean => validateProductName(name).isValid,
    },

    {
      type: "determineInput",
      key: "price",
      label: "정가",
      placeholder: "숫자만 입력해 주세요.",
      wrongMessage: (price: string | number): string => validateAndFormatPrice(price).message,
      rightMessage: (price: string | number): string => validateAndFormatPrice(price).message,
      isRight: (price: string | number): boolean => validateAndFormatPrice(price).isValid,
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
    },
    {
      type: "determineTextarea",
      key: "desc",
      label: "상품설명",
      placeholder: "상품에 대한 자세한 설명을 입력해주세요.",
      wrongMessage: (desc: string): string => validateProductDesc(desc).message,
      rightMessage: (desc: string): string => validateProductDesc(desc).message,
      isRight: (desc: string): boolean => validateProductDesc(desc).isValid,
      rows: 10,
      maxLength: 1000,
      onChange: (value: string) => {
        validateProductDesc(value).sanitizedValue;
        handleInputChange("desc", validateProductDesc(value).sanitizedValue);
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
    if (!formState) return;

    setFormState((prev: ProductType | undefined) => {
      if (!prev) return;
      return {
        ...prev,
        [key]: value,
      };
    });
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
    if (!formState) return;
    setFormState((prevState: ProductType | undefined) => {
      if (!prevState) return;
      return {
        ...prevState,
        category: { id: category.id, name: category.name },
      };
    });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 모든 필드 검증
    setFormState((prev: ProductType | undefined) => {
      if (!prev) return;
      return {
        ...prev,
        store_id: "9f0d3c81-9f15-4c9e-84f5-5fd44085494c",
      };
    });
    // 모든 필드 검증
    const validationResults = await Promise.all(
      Object.keys(formState ? formState : {})?.map(async (key) => {
        const typedKey = key as keyof ProductType;
        const value = formState?.[typedKey];

        const field = updateForm.find((f) => f.key === typedKey);
        if (field && isDetermineInput(field)) {
          return field.isRight(value as string);
        }
        return true;
      })
    );

    if (validationResults.some(Boolean)) {
      try {
        const variables: UpdateProductInput = {
          id: formState?.id || "",
          name: formState?.name || "",
          desc: formState?.desc,
          price: Number(formState?.price),
          sale: Number(formState?.sale),
          count: Number(formState?.count),
          category_id: Number(formState?.category.id),
        };

        if (mainImage) {
          variables.main_image_path = mainImage;
        }

        if (descImages.length > 0) {
          variables.desc_images_path = descImages;
        }

        await updateFc({
          variables,
          onCompleted: () => {
            navigate("/admin/product-info");
          },
          onError: () => {
            //TODO: 에러났다고 표시하고 그냥 product-info로 가기? 아니면 거기에 머무르기
          },
        });
      } catch (error) {
        console.error("Error during update: ", error);
      }
    } else {
      alert("형식을 다시 확인해주세요.");
    }
  };

  return (
    <div className="pt-5 pb-10">
      <Breadcrumb />
      {formState && (
        <form className="flex flex-col gap-4 content-center pt-10" onSubmit={handleUpdate}>
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
                      value={String(
                        formState[determineItem.key] ? formState[determineItem.key] : ""
                      )}
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
                } else if (item.type === "determineTextarea") {
                  const textareaItem = item as CustomProductDetermineTextareaProps;
                  return (
                    <DetermineTextarea
                      {...textareaItem}
                      key={textareaItem.key}
                      value={String(
                        formState?.[textareaItem.key] ? formState?.[textareaItem.key] : ""
                      )}
                      placeholder={textareaItem.placeholder}
                      onChange={(v) => handleInputChange("desc", v)}
                    />
                  );
                }

                return null;
              })}
              <SelectCategoryTree parentState={formState} onSelect={handleSelect} />
            </div>
            <div className="w-1/2 px-6 flex flex-col">
              <ImageUpload
                onImageSelect={handleMainImageSelect}
                title="제품 대표 사진 (필수)"
                multiple={false}
                rawUrls={[formState?.main_image_path]}
              />
              <ImageUpload
                onImageSelect={handleDescImageSelect}
                title="제품 설명란 첨부 사진"
                multiple={true}
                rawUrls={Array.from(formState?.desc_images_path || "[]")}
              />
            </div>
          </div>
          <div className="flex  justify-end">
            <NavLink to="/admin/product-info">
              <Button variant="outlined" className="mr-4 px-10" type="submit">
                상품 목록으로 가기
              </Button>
            </NavLink>
            <Button loading={updateLoading} variant="filled" className="mr-4 px-10" type="submit">
              상품 수정
            </Button>
          </div>
        </form>
      )}
      {loading && <p>제품 정보 불러오는 중...</p>}
      {error && <p style={{ color: "red" }}>An error occurred: {error.message}</p>}
      <div className="h-10" />
    </div>
  );
};

export default UpdateProduct;
