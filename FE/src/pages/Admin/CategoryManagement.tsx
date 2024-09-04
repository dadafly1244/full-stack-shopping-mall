import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Spinner, IconButton, Input, Button } from "@material-tailwind/react";
import { GET_ALL_CATEGORIES } from "#/apollo/query";
import { cn } from "#/utils/utils";
import { CREATE_CATEGORY, DELETE_CATEGORY } from "#/apollo/mutation";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const hasChildren = category.subcategories && category.subcategories.length > 0;
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const [deleteFc, { error: deleteError, loading }] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: GET_ALL_CATEGORIES, variables: { includeHierarchy: true } }],
    awaitRefetchQueries: true,
  });

  const [createFc, { error: createError, loading: createLoading }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_ALL_CATEGORIES, variables: { includeHierarchy: true } }],
    awaitRefetchQueries: true,
  });

  const handleDelete = (id: number) => {
    try {
      deleteFc({
        variables: {
          categoryId: id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateCategory = async (parentId: number) => {
    try {
      await createFc({
        variables: {
          name: newName,
          parentId,
        },
      });
      setIsCreateOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  if (loading || createLoading) return <Spinner className="h-12 w-12" />;
  if (deleteError || createError)
    return (
      <p className="text-red-500">
        Error: {deleteError?.message ? deleteError.message : createError?.message}
      </p>
    );

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
        {!hasChildren && (
          <IconButton
            color="white"
            className="shadow-none hover:shadow-none"
            onClick={() => handleDelete(Number(category.id))}
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white hover:shadow-sm"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
          </IconButton>
        )}
        {isCreateOpen && (
          <div className="flex justify-start content-center">
            <Input
              onChange={handleChange}
              placeholder="새로운 카테고리 이름을 입력해 주세요"
              crossOrigin={undefined}
            />
            <Button
              size="sm"
              className="break-keep"
              onClick={() => handleCreateCategory(Number(category.id))}
            >
              생성
            </Button>
          </div>
        )}
        {!isCreateOpen ? (
          <IconButton
            color="white"
            className="shadow-none hover:shadow-none"
            onClick={() => setIsCreateOpen(true)}
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14m-7 7V5"
              />
            </svg>
          </IconButton>
        ) : (
          <IconButton
            color="white"
            className="shadow-none hover:shadow-none"
            onClick={() => setIsCreateOpen(false)}
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14"
              />
            </svg>
          </IconButton>
        )}
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
  const [newName, setNewName] = useState("");
  const [createFc, { error: createError, loading: createLoading }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_ALL_CATEGORIES, variables: { includeHierarchy: true } }],
    awaitRefetchQueries: true,
  });
  const handleCreateCategory = async () => {
    try {
      await createFc({
        variables: {
          name: newName,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  if (createLoading) return <Spinner className="h-12 w-12" />;
  if (createError) return <p className="text-red-500">Error: {createError?.message}</p>;
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Category Tree</h2>
      <div className="flex justify-start content-center">
        <Input
          onChange={handleChange}
          placeholder="새로운 카테고리 이름을 입력해 주세요"
          crossOrigin={undefined}
        />
        <Button size="sm" className="break-keep" onClick={handleCreateCategory}>
          생성
        </Button>
      </div>
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
