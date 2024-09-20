import { cn } from "#/utils/utils";
import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
const categories = [
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

const CarouselSlider = ({
  current,
  onCategoryChange,
}: {
  current: string;
  onCategoryChange: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [move, setMove] = useState(5);
  const itemsPerPage = 5;
  const handleClick = (name: string) => {
    onCategoryChange(name);
  };
  const handleNext = () => {
    if (currentIndex + itemsPerPage < categories.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    } else {
      setCurrentIndex(categories.length - (categories.length % 5));
    }
  };

  useEffect(() => {
    if (currentIndex === 0) {
      setMove(5);
    } else {
      setMove(-20 * currentIndex + 5);
    }
  }, [currentIndex]);

  return (
    <div className="relative w-full overflow-hidden my-10">
      {/* Carousel Items */}
      <div className="flex items-center overflow-hidden">
        <div
          className="flex w-[calc(100%-10rem)] transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(${move}%)`,
          }}
        >
          <div key="all" className={`w-1/5 flex-shrink-0 p-2`}>
            <Button
              onClick={() => handleClick("")}
              className={cn(
                current === "" && "bg-blue-gray-500",
                "w-24 bg-white text-blue-gray-400 py-2 rounded text-center shadow-none hover:shadow-none hover:text-gray-900"
              )}
            >
              전체
            </Button>
          </div>
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`w-1/5 flex-shrink-0 p-2 ${
                index === currentIndex + 4 ? "opacity-50" : ""
              }`}
            >
              <Button
                onClick={() => handleClick(category.name)}
                className={cn(
                  current === category.name && "bg-blue-gray-500",
                  "w-24 bg-white text-blue-gray-400 py-2 rounded text-center shadow-none hover:shadow-none hover:text-gray-900"
                )}
              >
                {category.name}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Button */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2  rounded px-2 py-1"
        onClick={handlePrev}
        // disabled={currentIndex === 0}
      >
        <svg
          className="fill-blue-gray-800 w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            fill="#000"
            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
          />
        </svg>
      </button>

      {/* Next Button */}
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-300 px-2 py-1"
        onClick={handleNext}
        // disabled={currentIndex + itemsPerPage >= categories.length}
      >
        <svg
          className="fill-blue-gray-800 w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
            fill="#000"
          />
        </svg>
      </button>
    </div>
  );
};

export default CarouselSlider;
