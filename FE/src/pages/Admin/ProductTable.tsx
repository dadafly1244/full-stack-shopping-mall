import React, { useState, useCallback, useEffect } from "react";
import { cn } from "#/utils/utils";
import { formatNumber } from "#/utils/formatter";
import ProductImage from "#/common/ProductImage";
import { ProductType } from "#/utils/types";

function ProductTable({ data, columns, onSelectionChange }) {
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setSelectedItems([]);
  }, [data]);

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSelectedItems = e.target.checked ? data : [];
      setSelectedItems(newSelectedItems);
      onSelectionChange?.(newSelectedItems);
    },
    [data, onSelectionChange]
  );

  const handleSelectItem = useCallback(
    (item) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSelectedItems = e.target.checked
        ? [...selectedItems, item]
        : selectedItems.filter((i) => i.id !== item.id);
      setSelectedItems(newSelectedItems);
      onSelectionChange?.(newSelectedItems);
    },
    [selectedItems, onSelectionChange]
  );

  const isSelected = useCallback(
    (item) => selectedItems.some((i) => i.id === item.id),
    [selectedItems]
  );

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item);
    }
    const value = item[column.key];
    if (value === undefined || value === null) {
      return "-";
    }
    if (typeof value === "string" || typeof value === "boolean") {
      return value.toString();
    }
    if (typeof value === "number") {
      return formatNumber(value);
    }
    return JSON.stringify(value);
  };

  return (
    <div className="overflow-x-auto min-h-[500px]">
      <table className="min-w-full  bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-2 px-2 text-left">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedItems?.length === data?.length}
              />
            </th>
            <th key="main_image_path" className=" py-2 px-4 text-left whitespace-nowrap">
              제품 이미지
            </th>
            {columns.map((column) => (
              <th
                key={column.key as string}
                className={cn(
                  "py-2 px-4 text-left",
                  ["sale", "price", "count", "status"].includes(column.key) && "text-center"
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        {selectedItems?.length || data?.length ? (
          <tbody className="text-gray-600 text-sm font-normal h-full">
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-100 "
                onClick={() => onRowClick?.(item)}
              >
                <td className="py-2 px-2 text-left text-wrap">
                  <input
                    type="checkbox"
                    onChange={handleSelectItem(item)}
                    checked={isSelected(item)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td key="main_image_path" className=" py-2 px-4 flex justify-center">
                  <div className="relative h-16 w-16 group">
                    <ProductImage
                      imagePath={item.main_image_path}
                      alt={`${item.name}제품의 대표 이미지`}
                      className="h-16 w-16 cursor-pointer rounded-lg object-contain object-center border border-solid border-gray-200"
                    />
                    {!!item.desc_images_path?.length && (
                      <div className="absolute right-0 bottom-0 font-bold text-gray-600 text-sm bg-blue-gray-50 rounded-sm hidden group-hover:block">
                        +{item.desc_images_path?.length}
                      </div>
                    )}
                  </div>
                </td>

                {columns.map((column) => (
                  <td
                    key={column.key as string}
                    className={cn(
                      "max-w-56 max-h-16 py-2 px-4 text-left whitespace-nowrap",
                      column.key === "desc" && "overflow-x-hidden overflow-ellipsis",
                      ["sale", "price", "count"].includes(column.key) && "text-center"
                      // column.key === "name" && "max-w-36 overflow-x-hidden overflow-ellipsis"
                    )}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody className="min-h-[500px] text-gray-600 text-lg font-normal">
            <tr className="w-full">
              <div>값이 없습니다.</div>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}

export default ProductTable;
