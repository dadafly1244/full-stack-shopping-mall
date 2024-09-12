import { Carousel } from "@material-tailwind/react";

import NoImage from "src/assets/noImage.png";
import { ad } from "#/const";

const Ad = () => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    img.onerror = null;
    img.src = NoImage;
  };
  return (
    <Carousel transition={{ duration: 0.3 }} className=" h-auto bg-gray-100 mt-10 w-full">
      {!ad?.length && (
        <div className="grid h-80 w-full place-items-center rounded-lg bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-full text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
      )}
      {ad &&
        ad?.map((p: { id: number; name: string; path: string }) => {
          return (
            <img
              key={p.id}
              alt={p.name}
              src={p.path}
              className="w-full object-contain object-center "
              onError={handleImageError}
            />
          );
        })}
    </Carousel>
  );
};

export default Ad;
