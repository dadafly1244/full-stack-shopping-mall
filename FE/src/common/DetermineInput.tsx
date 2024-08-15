import { ReactElement, useState } from "react";
import { twJoin } from "tailwind-merge";

export interface DetermineInputProps {
  label: string;
  key?: string;
  placeholder?: string;
  wrongMessage?: string;
  rightMessage?: string;
  isRight: (value: string) => boolean;
  inputLimit?: string;
  isRequired?: boolean;
  inputWidth?: number;
  className?: string;
  formatter?: (value: string) => string;
  onChange?: (value: string) => void;
}

const DetermineInput = (props: DetermineInputProps): ReactElement => {
  const {
    label = "입력",
    placeholder = "입력해주세요",
    wrongMessage = "다시 입력해주세요.",
    rightMessage = "",
    isRight,
    isRequired = false,
    className,
    onChange,
    formatter,
    inputWidth,
  } = props;
  const [_inputValue, setInputValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (onChange) {
      onChange(inputValue);
    }
    setInputValue(inputValue);
  };

  const handleBlur = () => {
    if (formatter) {
      setInputValue(formatter(_inputValue));
    }
  };
  return (
    <div>
      <div className="mb-6">
        <label
          htmlFor={`determineInput-${label}`}
          className={twJoin(
            "block mb-2 text-sm font-medium",
            isRight(_inputValue)
              ? " text-green-700 dark:text-green-500"
              : " text-red-700 dark:text-red-500"
          )}
        >
          {label ? label : "입력"} {isRequired ? "(필수)" : ""}
        </label>
        <input
          type={label === "비밀번호" ? "password" : "text"}
          id={`determineInput-${label}`}
          value={_inputValue}
          required={isRequired}
          width={inputWidth}
          className={twJoin(
            isRight(_inputValue)
              ? "bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
              : "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500",
            className
          )}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <p
          className={twJoin(
            "mt-2 text-sm",
            isRight(_inputValue)
              ? " text-green-600 dark:text-green-500"
              : "text-red-600 dark:text-red-500"
          )}
        >
          {isRight(_inputValue) ? rightMessage : wrongMessage}
        </p>
      </div>
    </div>
  );
};

export default DetermineInput;
