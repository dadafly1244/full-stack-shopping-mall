import ProductImage from "#/common/ProductImage";
import NoImage from "#/assets/noImage.png";
import { ProductType } from "#/utils/types";
import { formatNumber, isWithinWeek } from "#/utils/formatter";

const NewProductCard = ({ product }: { product: ProductType }) => {
  const isNewProduct = isWithinWeek(product?.created_at as string);
  return (
    <div className="hover:cursor-pointer hover:bg-white group overflow-hidden">
      <div className="flex h-64 items-start w-64 relative self-stretch ">
        <ProductImage
          key="headerImage"
          alt="New products header image "
          imagePath={product.main_image_path}
          fallbackImage={NoImage}
          className="flex-1 grow relative self-stretch  group-hover:scale-110"
        />
        {isNewProduct && (
          <div className="flex-col inline-flex items-center justify-center px-2 py-1 absolute top-0 left-0 bg-color-background-positive-default rounded-[6px_0px_6px_0px] bg-green-400">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-xs tracking-[0] leading-4 whitespace-nowrap">
              New Arrival
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-1 p-3 relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative self-stretch mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-6 truncate">
          {product.name}
        </div>
        <div className="relative self-stretch [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-lg tracking-[0] leading-7 ml-auto">
          <span className="line-through font-light text-xs mr-1">
            {formatNumber(Number(product.price))}원
          </span>
          <span className="font-bold text-red-600">
            {product.sale
              ? formatNumber(Number(product.sale))
              : formatNumber(Number(product.price))}
            원
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewProductCard;
