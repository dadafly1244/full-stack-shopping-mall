import React from "react";
import NoImage from "#/assets/noImage.png";

interface ProductImageProps {
  imagePath: string;
  alt?: string;
  fallbackImage?: string;
  className?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({
  imagePath,
  alt = "Product",
  fallbackImage = NoImage,
  className,
}) => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    img.onerror = null;
    img.src = fallbackImage;
  };

  return (
    <img
      src={`${import.meta.env.VITE_BE_URL}${imagePath}`}
      alt={alt}
      onError={handleImageError}
      className={className}
    />
  );
};

export default ProductImage;
