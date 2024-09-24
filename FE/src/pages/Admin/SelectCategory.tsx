import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Spinner, IconButton } from "@material-tailwind/react";
import { GET_ALL_CATEGORIES } from "#/apollo/query";
import { cn } from "#/utils/utils";
import { ProductType, CategoryType, CreateProductStateType } from "#/utils/types";

// Types

interface TreeNodeProps {
  category: CategoryType;
  level: number;
  selectedId: number | null;
  onSelect: (category: CategoryType) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ category, level, selectedId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.subcategories && category.subcategories.length > 0;

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = () => {
    onSelect(category);
  };

  return (
    <div
      className={cn(
        `ml-${level * 3}`,
        level === 0 ? "border-t border-blue-gray-400" : "border-none"
      )}
    >
      <div className="flex items-center">
        {hasChildren ? (
          <IconButton variant="text" onClick={toggleOpen} className="mr-2 w-8 h-8">
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </IconButton>
        ) : (
          <IconButton disabled variant="text" className="mr-2 w-8 h-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </IconButton>
        )}
        <span
          className={cn(
            "hover:cursor-pointer text-xs",
            selectedId === category.id ? "text-red-500" : "text-gray-800"
          )}
          onClick={handleClick}
        >
          {category.name}
        </span>
      </div>
      {isOpen && hasChildren && (
        <div className="ml-4">
          {category.subcategories!.map((subCategory) => (
            <TreeNode
              key={subCategory.id}
              category={subCategory}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CategoryTreeProps {
  categories: CategoryType[];
  selectedCategory: ProductType["category"];
  onSelect: (category: CategoryType) => void;
}

const SelectCategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  selectedCategory,
  onSelect,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-sm font-bold mb-2 text-gray-800">
        카테고리 :
        {selectedCategory?.name && (
          <span className="ml-2 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            {selectedCategory?.name}
          </span>
        )}
      </h2>
      {categories.map((category) => (
        <TreeNode
          key={category.id}
          category={category}
          level={0}
          selectedId={selectedCategory?.id ?? null}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

interface CategoryTreeContainerProps {
  parentState: ProductType | CreateProductStateType;
  onSelect: (category: CategoryType) => void;
}

const CategoryTreeContainer: React.FC<CategoryTreeContainerProps> = ({ parentState, onSelect }) => {
  const { loading, error, data } = useQuery(GET_ALL_CATEGORIES, {
    variables: { includeHierarchy: true },
  });

  if (loading) return <Spinner className="h-12 w-12" />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <>
      <SelectCategoryTree
        categories={data.categories}
        selectedCategory={parentState.category}
        onSelect={onSelect}
      />
    </>
  );
};

export { CategoryTreeContainer as SelectCategoryTree };
