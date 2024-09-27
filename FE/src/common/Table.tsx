import React, { useState, useCallback, ReactNode, useEffect } from "react";
import { TableColumn, TableProps } from "#/utils/types";

function Table<T extends { id?: string }, S = T>({
  title,
  data,
  columns,
  sortState,
  onSortClick,
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

  const handleSorting = (e: React.MouseEvent, key: keyof S) => {
    e.stopPropagation();
    onSortClick?.(key);
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
                {column.sort && (
                  <button onClick={(e) => handleSorting(e, column.sort as keyof S)}>
                    {sortState?.[column.sort] === "none" && "#"}
                    {sortState?.[column.sort] === "asc" && "▲"}
                    {sortState?.[column.sort] === "desc" && "▼"}
                  </button>
                )}
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
          <tbody className="text-gray-600 text-sm font-normal">값이 없습니다.</tbody>
        )}
      </table>
    </div>
  );
}

export default Table;
