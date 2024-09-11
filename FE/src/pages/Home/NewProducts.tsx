import ProductImage from "#/common/ProductImage";
import NoImage from "#/assets/noImage.png";
import NewImage from "#/assets/new.png";
import { ProductType } from "#/utils/types";
import React from "react";

const NewProducts = ({ data }: { data: ProductType }) => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    img.onerror = null;
    img.src = NoImage;
  };
  return (
    <div className="max-w-screen-xl h-auto">
      <div></div>
      <div className="w-full flex justify-start">
        <img
          key="headerImage"
          alt="New products header image"
          src={NewImage}
          className="h-44 w-44 object-contain object-center "
          onError={handleImageError}
        />
        <h4 className="flex-wrap justify-start content-center w-full font-bold text-5xl ml-14">
          <span className="align-middle">NEW </span>
          <span className="align-middle">오늘의 신상품</span>
        </h4>
      </div>
      <div>
        {/* <ProductImage
          key="headerImage"
          alt="New products header image"
          imagePath={NewImage}
          fallbackImage={NoImage}
          className="h-80 w-full object-contain object-center"
        /> */}
      </div>
    </div>
  );
};

export default NewProducts;
