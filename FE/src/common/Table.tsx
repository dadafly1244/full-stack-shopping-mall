import React, { useState, useCallback, ReactNode, useEffect } from "react";
import { TableColumn, TableProps } from "#/utils/types";
import { NavLink } from "react-router-dom";
import { Button } from "@material-tailwind/react";

function Table<T extends { id?: string }, S = T>({
  title,
  data,
  columns,
  onSelectionChange,
}: TableProps<T, S>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

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
    (item: T) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSelectedItems = e.target.checked
        ? [...selectedItems, item]
        : selectedItems.filter((i) => i.id !== item.id);
      setSelectedItems(newSelectedItems);
      onSelectionChange?.(newSelectedItems);
    },
    [selectedItems, onSelectionChange]
  );

  const isSelected = useCallback(
    (item: T) => selectedItems.some((i) => i.id === item.id),
    [selectedItems]
  );

  const renderCell = (item: T, column: TableColumn<T, S>): ReactNode => {
    if (column.render) {
      return column.render(item);
    }
    const value = item[column.key];
    if (value === undefined || value === null) {
      return "-";
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return value.toString();
    }
    return JSON.stringify(value);
  };
  return (
    <div className="overflow-x-auto">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedItems?.length === data?.length}
              />
            </th>
            {columns.map((column) => (
              <th key={column.key as string} className="py-3 px-6 text-left">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        {selectedItems?.length || data?.length ? (
          <tbody className="text-gray-600 text-sm font-normal">
            {data.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <input
                    type="checkbox"
                    onChange={handleSelectItem(item)}
                    checked={isSelected(item)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                {columns.map((column) => (
                  <td key={column.key as string} className="py-3 px-6 text-left whitespace-nowrap">
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody className="text-gray-600 text-sm font-normal"> </tbody>
        )}
      </table>
      {selectedItems?.length || data?.length ? null : (
        <div className="w-full h-full py-40 px-96 flex flex-col justify-center content-center items-center">
          <div className="w-full  flex flex-col justify-center items-center">
            <div className="w-56 h-56">
              <svg
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
              </svg>
            </div>
            <div className="text-gray-600 text-2xl font-extrabold">no data found</div>
            <NavLink to="/admin">
              <Button className="w-52">홈 페이지로 되돌아가기</Button>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
