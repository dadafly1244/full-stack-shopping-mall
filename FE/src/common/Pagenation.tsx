import { useState } from "react";
import { Button, IconButton } from "@material-tailwind/react";

const CircularPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const [active, setActive] = useState(currentPage);

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = -2; i <= 2; i++) {
      pageNumbers.push(currentPage + i);
    }
    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    setActive(page);
    onPageChange(page);
  };

  const next = () => {
    if (active < totalPages) {
      handlePageChange(active + 1);
    }
  };

  const prev = () => {
    if (active > 1) {
      handlePageChange(active - 1);
    }
  };

  const getItemProps = (index: number) =>
    ({
      variant: active === index ? "filled" : "text",
      color: "gray",
      onClick: () => handlePageChange(index),
      disabled: index < 1 || index > totalPages,
      className: `rounded-full ${
        index < 1 || index > totalPages ? "opacity-0 cursor-default" : ""
      }`,
    } as const);

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={active === 1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Previous
      </Button>
      <div className="flex items-center gap-2">
        {getPageNumbers().map((pageNumber) => (
          <IconButton key={pageNumber} {...getItemProps(pageNumber)}>
            {pageNumber >= 1 && pageNumber <= totalPages ? pageNumber : ""}
          </IconButton>
        ))}
      </div>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={next}
        disabled={active === totalPages}
      >
        Next
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </Button>
    </div>
  );
};
export default CircularPagination;
