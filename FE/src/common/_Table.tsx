import React, { useState, useCallback, ReactNode } from "react";
import { sortingItem } from "#/utils/types";

export interface TableColumn<T> {
  header: string;
  sort?: string;
  key: keyof T;
  render?: (item: T) => ReactNode;
}

export interface TableProps<T> {
  title: string;
  data: T[];
  columns: TableColumn<T>[];
  onSortClick?: (key: keyof sortingItem) => void;
  onRowClick?: (item: T) => void;
  onSelectionChange?: (selectedItems: T[]) => void;
  sortState: sortingItem;
}

function Table<T extends { id?: string }>({
  title,
  data,
  columns,
  sortState,
  onSortClick,
  onRowClick,
  onSelectionChange,
}: TableProps<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

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

  const renderCell = (item: T, column: TableColumn<T>): ReactNode => {
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

  const handleSorting = (e: React.MouseEvent, key: keyof sortingItem) => {
    e.stopPropagation;

    onSortClick?.(key);
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedItems.length === data.length}
              />
            </th>
            {columns.map((column) => (
              <th key={column.key as string} className="py-3 px-6 text-left">
                {column.header}
                {column.sort && (
                  <button onClick={(e) => handleSorting(e, column.key as keyof sortingItem)}>
                    {sortState[column.key as keyof sortingItem] === "none" && "#"}
                    {sortState[column.key as keyof sortingItem] === "asc" && "▲"}
                    {sortState[column.key as keyof sortingItem] === "desc" && "▼"}
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {data.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 hover:bg-gray-100"
              onClick={() => onRowClick?.(item)}
            >
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
      </table>
    </div>
  );
}

export default Table;