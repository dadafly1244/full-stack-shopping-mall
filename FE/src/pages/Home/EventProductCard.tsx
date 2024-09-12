import ProductImage from "#/common/ProductImage";
import NoImage from "#/assets/noImage.png";
import { ProductType } from "#/utils/types";
import {
  formatNumber,
  isSignificantDiscount,
  calculateDiscountPercentage,
} from "#/utils/formatter";

const NewProductCard = ({ product }: { product: ProductType }) => {
  const isNewProduct = isSignificantDiscount(product?.sale, product.price);
  const percentage = calculateDiscountPercentage(product?.sale, product.price);
  return (
    <div className="border border-solid border-gray-300 rounded-md ">
      <div className="flex h-64 w-full items-start  relative  box-border">
        <ProductImage
          key="headerImage"
          alt="New products header image"
          imagePath={product.main_image_path}
          fallbackImage={NoImage}
          className="flex relative self-stretch"
        />
        {percentage > 0 && (
          <div className="flex-col inline-flex items-center justify-center px-2 py-1 absolute top-0 right-0 bg-color-background-positive-default rounded-[6px_0px_6px_0px] bg-lime-700">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-xs tracking-[0] leading-4 whitespace-nowrap">
              {percentage}% OFF
            </div>
          </div>
        )}
        {isNewProduct && (
          <div className="flex-col inline-flex items-center justify-center px-2 py-1 absolute top-0 left-0 bg-color-background-positive-default rounded-[0px_6px_0px_6px] bg-red-400">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-xs tracking-[0] leading-4 whitespace-nowrap">
              Big Sale
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-1 p-3 relative self-stretch fit-content flex-[0_0_auto]">
        <div className="relative h-10 self-stretch mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-6 truncate">
          {product.name}
        </div>
        <div className="relative h-20 self-stretch mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-sm tracking-[0] leading-6 truncate whitespace-pre">
          {product.desc}
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
