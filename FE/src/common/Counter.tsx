import { cn } from "#/utils/utils";
import { Button } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

interface classNameType {
  container?: string;
  leftButton?: string;
  rightButton?: string;
  input?: string;
}

const Counter = ({
  defaultValue = 0,
  maxValue = 1000,
  onChangeCount,
  classNames,
}: {
  defaultValue: number;
  maxValue: number;
  onChangeCount: (num: number) => void;
  classNames?: classNameType;
}) => {
  const [count, setCount] = useState(defaultValue);
  const [maxV] = useState(maxValue ? Number(maxValue) : 100000);

  useEffect(() => {
    onChangeCount(count);
  }, [count, onChangeCount]);

  const handleChangeCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = Number(e.target.value);
    if (newCount < 1) {
      setCount(1);
    } else {
      setCount(newCount);
    }
  };

  const handelAddCount = () => {
    setCount((prev) => prev + 1);
  };

  const handleMinusCount = () => {
    setCount((prev) => prev - 1);
  };
  return (
    <div
      className={cn(
        "flex justify-center content-center items-center border-2 border-solid border-gray-200 bg-blue-gray-50",
        `${classNames?.container}`
      )}
    >
      <Button
        variant="text"
        onClick={handleMinusCount}
        className={cn(" w-10 h-10 p-2 flex justify-center items-center", classNames?.leftButton)}
        disabled={count <= 1}
      >
        <div className="text-base font-bold ">-</div>
      </Button>
      <input
        onChange={handleChangeCount}
        value={count}
        className={cn(
          "w-14 h-10 text-center border-x-2 border-solid border-gray-200   bg-white",
          classNames?.input
        )}
      />
      <Button
        variant="text"
        onClick={handelAddCount}
        className={cn("w-10 h-10 p-2  flex justify-center items-center ", classNames?.rightButton)}
        disabled={count >= maxV}
      >
        <div className="text-base font-bold">+</div>
      </Button>
    </div>
  );
};

export default Counter;
