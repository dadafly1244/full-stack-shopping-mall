import ProductImage from "#/common/ProductImage";
import NoImage from "#/assets/noImage.png";
import NewImage from "#/assets/new.png";
import { ProductType } from "#/utils/types";
import React from "react";

const NewProducts = ({ data }: { data: ProductType }) => {
  return (
    <div>
      <div>
        <ProductImage
          key="headerImage"
          alt="New products header image"
          imagePath={NewImage}
          fallbackImage={NoImage}
          className="h-80 w-full object-contain object-center"
        />
      </div>
    </div>
  );
};

export default NewProducts;
