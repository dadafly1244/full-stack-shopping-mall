import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Spinner, IconButton } from "@material-tailwind/react";
import { GET_ALL_CATEGORIES } from "#/apollo/query";
// import { useCopyToClipboard } from "usehooks-ts";
import { cn } from "#/utils/utils";

// Types
interface Category {
  id: string;
  name: string;
  subcategories?: Category[];
}

interface TreeNodeProps {
  category: Category;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ category, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [, copy] = useCopyToClipboard();
  // const [copied, setCopied] = React.useState(false);
  const hasChildren = category.subcategories && category.subcategories.length > 0;
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={cn(
        `ml-${level * 3}`,
        level === 0 ? "border-t border-blue-gray-400" : "border-none"
      )}
    >
      <div className="flex items-center py-2 ">
        {!hasChildren && (
          <IconButton disabled variant="text" size="sm" onClick={toggleOpen} className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
        {hasChildren && (
          <IconButton variant="text" size="sm" onClick={toggleOpen} className="mr-2">
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
                width="16"
                height="16"
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
        )}
        <span className="text-gray-800">{category.name}</span>
        {/* <IconButton
          className="bg-white shadow-none"
          onMouseLeave={() => setCopied(false)}
          onClick={() => {
            copy(category.id)
              .then(() => {
                console.log("Copied!", { text: category.id });
              })
              .catch((error) => {
                console.error("Failed to copy!", error);
              });
          }}
        >
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </IconButton> */}
      </div>
      {isOpen && hasChildren && (
        <div className="ml-4">
          {category.subcategories!.map((subCategory) => (
            <TreeNode key={subCategory.id} category={subCategory} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface CategoryTreeProps {
  categories: Category[];
}

const CategoryTree: React.FC<CategoryTreeProps> = ({ categories }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Category Tree</h2>
      {categories.map((category) => (
        <TreeNode key={category.id} category={category} level={0} />
      ))}
    </div>
  );
};

const CategoryTreeContainer: React.FC = () => {
  const { loading, error, data } = useQuery(GET_ALL_CATEGORIES, {
    variables: { includeHierarchy: true },
  });

  if (loading) return <Spinner className="h-12 w-12" />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return <CategoryTree categories={data.categories} />;
};

export { CategoryTreeContainer as CategoryTree };
