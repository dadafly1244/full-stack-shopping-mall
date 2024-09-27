import NoImage from "#/assets/noImage.png";
import EventImage from "#/assets/sale.png";
import { ProductType } from "#/utils/types";
import React from "react";
import EventProductCard from "#/pages/Home/EventProductCard";

const EventProducts = ({ data }: { data: ProductType[] }) => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    img.onerror = null;
    img.src = NoImage;
  };
  return (
    <div className="max-w-screen-xl h-auto">
      <div className="w-full flex mb-7">
        <img
          key="headerImage"
          alt="New products header image"
          src={EventImage}
          className="h-22 w-22 object-contain object-center "
          onError={handleImageError}
        />
        <h4 className="flex-wrap justify-start content-center w-fit font-bold text-3xl ml-10 mr-16">
          <span className="align-middle">오늘의 할인 Event</span>
          <span className="align-middle"> & 무료배송</span>
        </h4>
      </div>
      <div className="grid grid-cols-2 items-center auto-rows-max gap-10 rounded-md overflow-scroll mb-28 md:grid-cols-4 ">
        {data?.map((p: ProductType) => (
          <EventProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default EventProducts;
