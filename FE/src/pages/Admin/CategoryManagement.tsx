import React, { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Spinner, IconButton, Input, Button } from "@material-tailwind/react";
import { GET_ALL_CATEGORIES } from "#/apollo/query";
import { cn } from "#/utils/utils";
import { CREATE_CATEGORY, DELETE_CATEGORY } from "#/apollo/mutation";
import NotificationDialog from "#/common/NotificationDialog";

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

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const [deleteFc, { error: deleteError }] = useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: GET_ALL_CATEGORIES, variables: { includeHierarchy: true } }],
    awaitRefetchQueries: true,
  });

  const [createFc, { error: createError }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_ALL_CATEGORIES, variables: { includeHierarchy: true } }],
    awaitRefetchQueries: true,
  });

  const [isCreateErrorOpen, setIsCreateErrorOpen] = useState(false);

  useEffect(() => {
    if (createError) setIsCreateErrorOpen(true);
  }, [createError]);

  const [isDeleteErrorOpen, setIsDeleteErrorOpen] = useState(false);

  useEffect(() => {
    if (deleteError) setIsDeleteErrorOpen(true);
  }, [deleteError]);

  const handleDelete = useCallback(
    (id: number) => {
      deleteFc({
        variables: {
          categoryId: id,
        },
      }).catch(console.error);
    },
    [deleteFc]
  );

  const handleCreateCategory = useCallback(
    async (parentId: number) => {
      try {
        await createFc({
          variables: {
            name: newName,
            parentId,
          },
        });
        setIsCreateOpen(false);
        setNewName("");
      } catch (error) {
        console.error(error);
      }
    },
    [createFc, newName]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  }, []);

  return (
    <div
      className={cn(
        `ml-${level * 3}`,
        level === 0 ? "border-b border-blue-gray-400" : "border-none"
      )}
    >
      <NotificationDialog
        isOpen={isCreateErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다.\n${createError?.message}`}
        onClose={() => setIsCreateErrorOpen(false)}
      />
      <NotificationDialog
        isOpen={isDeleteErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다.\n${deleteError?.message}`}
        onClose={() => setIsDeleteErrorOpen(false)}
      />
      <div className="flex items-center py-2">
        <IconButton
          variant="text"
          size="sm"
          onClick={toggleOpen}
          className="mr-2"
          disabled={!hasChildren}
        >
          {hasChildren &&
            (isOpen ? (
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
            ))}
        </IconButton>
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
        {isCreateOpen ? (
          <div className="flex justify-start content-center">
            <Input
              onChange={handleChange}
              value={newName}
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
        ) : (
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

const CategoryTree: React.FC<{
  categories: Category[];
}> = ({ categories }) => {
  const [newName, setNewName] = useState("");
  const [createFc, { error }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_ALL_CATEGORIES, variables: { includeHierarchy: true } }],
    awaitRefetchQueries: true,
  });
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  useEffect(() => {
    if (error) setIsErrorOpen(true);
  }, [error]);
  const handleCreateCategory = useCallback(async () => {
    try {
      await createFc({
        variables: {
          name: newName,
        },
      });
      setNewName("");
    } catch (error) {
      console.error(error);
    }
  }, [createFc, newName]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  }, []);

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow">
      <NotificationDialog
        isOpen={isErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다.\n${error?.message}`}
        onClose={() => setIsErrorOpen(false)}
      />
      <div className="flex justify-start content-center w-60">
        <Input
          onChange={handleChange}
          value={newName}
          placeholder="새로운 카테고리 이름을 입력해 주세요"
          crossOrigin={undefined}
        />
        <Button size="sm" className="min-w-20" onClick={handleCreateCategory}>
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
  if (error)
    return (
      <div>
        <div className="w-full flex flex-col justify-center content-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-16 h-16 fill-red-600 mb-5"
          >
            <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
          </svg>
        </div>
        <span className="w-full whitespace-pre-wrap">에러가 발생했습니다. {error?.message}</span>
      </div>
    );

  return <CategoryTree categories={data.categories} />;
};

export { CategoryTreeContainer as CategoryTree };
