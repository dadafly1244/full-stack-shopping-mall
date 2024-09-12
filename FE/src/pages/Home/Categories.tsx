import { cn } from "#/utils/utils";
import { Button } from "@material-tailwind/react";
import React from "react";

const category = [
  {
    id: 1,
    name: "전자제품",
    category_parent_id: null,
  },
  {
    id: 2,
    name: "취미",
    category_parent_id: null,
  },
  {
    id: 3,
    name: "옷",
    category_parent_id: null,
  },
  {
    id: 4,
    name: "마법",
    category_parent_id: null,
  },
  {
    id: 5,
    name: "리빙",
    category_parent_id: null,
  },
  {
    id: 6,
    name: "휴대폰",
    category_parent_id: 1,
  },
  {
    id: 7,
    name: "컴퓨터",
    category_parent_id: 1,
  },
  {
    id: 8,
    name: "노트북",
    category_parent_id: 1,
  },
  {
    id: 9,
    name: "애플",
    category_parent_id: 6,
  },
  {
    id: 10,
    name: "삼성",
    category_parent_id: 6,
  },
  {
    id: 11,
    name: "전체",
    category_parent_id: 7,
  },
  {
    id: 12,
    name: "부품",
    category_parent_id: 7,
  },
  {
    id: 13,
    name: "그램",
    category_parent_id: 8,
  },
  {
    id: 14,
    name: "다이어리",
    category_parent_id: 2,
  },
  {
    id: 15,
    name: "차/다도",
    category_parent_id: 2,
  },
  {
    id: 16,
    name: "여성복",
    category_parent_id: 3,
  },
  {
    id: 17,
    name: "남성복",
    category_parent_id: 3,
  },
  {
    id: 18,
    name: "해리포터",
    category_parent_id: 4,
  },
  {
    id: 19,
    name: "신동사",
    category_parent_id: 4,
  },
  {
    id: 20,
    name: "가구",
    category_parent_id: 5,
  },
  {
    id: 21,
    name: "미용",
    category_parent_id: 5,
  },
  {
    id: 23,
    name: "신발",
    category_parent_id: 4,
  },
];

const Categories = ({
  current,
  onCategoryChange,
}: {
  current: string;
  onCategoryChange: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleClick = (name: string) => {
    onCategoryChange(name);
  };
  return (
    <div className="max-w-screen-xl flex mb-7 mt-28 overflow-y-scroll">
      <Button
        key={0}
        name="전체"
        onClick={() => handleClick("")}
        className={cn(
          "m-5 py-0.5 px-10 text-sm break-keep min-w-fit rounded-full",
          current === "" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
        )}
      >
        전체
      </Button>
      {category.map((c) => (
        <Button
          key={c.id}
          name={c.name}
          onClick={() => handleClick(c.name)}
          className={cn(
            "m-5 py-0.5 px-10 text-sm break-keep min-w-fit rounded-full",
            current === c.name ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
          )}
        >
          {c.name}
        </Button>
      ))}
    </div>
  );
};

export default Categories;
