import { cn } from "#/utils/utils";
import { Button } from "@material-tailwind/react";
import React, { useEffect, useState, useCallback } from "react";

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

  const handleChangeCount = useCallback(
    (newCount: number) => {
      if (newCount < 1) {
        setCount(1);
        onChangeCount(1);
      } else if (newCount > maxV) {
        setCount(maxV);
        onChangeCount(maxV);
      } else {
        setCount(newCount);
        onChangeCount(newCount);
      }
    },
    [maxV, onChangeCount]
  );

  useEffect(() => {
    if (defaultValue !== count) {
      handleChangeCount(defaultValue);
    }
  }, [defaultValue, count, handleChangeCount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = Number(e.target.value);
    handleChangeCount(newCount);
  };

  const handelAddCount = () => {
    handleChangeCount(count + 1);
  };

  const handleMinusCount = () => {
    handleChangeCount(count - 1);
  };

  return (
    <div
      className={cn(
        "flex justify-center content-center items-center border-2 border-solid border-gray-200 bg-blue-gray-50",
        classNames?.container
      )}
    >
      <Button
        variant="text"
        onClick={handleMinusCount}
        className={cn("w-10 h-10 p-2 flex justify-center items-center", classNames?.leftButton)}
        disabled={count <= 1}
      >
        <div className="text-base font-bold">-</div>
      </Button>
      <input
        onChange={handleInputChange}
        value={count}
        className={cn(
          "w-14 h-10 text-center border-x-2 border-solid border-gray-200 bg-white",
          classNames?.input
        )}
      />
      <Button
        variant="text"
        onClick={handelAddCount}
        className={cn("w-10 h-10 p-2 flex justify-center items-center", classNames?.rightButton)}
        disabled={count >= maxV}
      >
        <div className="text-base font-bold">+</div>
      </Button>
    </div>
  );
};

export default Counter;
