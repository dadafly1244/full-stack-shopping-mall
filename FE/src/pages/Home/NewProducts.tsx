import NoImage from "#/assets/noImage.png";
import NewImage from "#/assets/new.png";
import { ProductType } from "#/utils/types";
import React from "react";
import NewProductCard from "./NewProductCard";

const NewProducts = ({ data }: { data: ProductType[] }) => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    img.onerror = null;
    img.src = NoImage;
  };
  return (
    <div className="max-w-screen-xl h-auto">
      <div className="w-full flex justify-start mb-7">
        <img
          key="headerImage"
          alt="New products header image"
          src={NewImage}
          className="h-20 w-20 object-contain object-center "
          onError={handleImageError}
        />
        <h4 className="flex-wrap justify-start content-center w-full font-bold text-3xl ml-14">
          <span className="align-middle">오늘의 신상품</span>
        </h4>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-10 relative rounded-md overflow-hidden mb-14">
        {data?.map((p: ProductType) => (
          <NewProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default NewProducts;
