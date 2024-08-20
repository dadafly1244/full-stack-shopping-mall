import { ReactElement, useState, useEffect, useCallback } from "react";
import { cva } from "class-variance-authority";
import { cn } from "#/utils/utils";
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
  variant?: "default" | "pass" | "nonePass";
  button?: string | (() => Promise<string>);
  buttonClick?: (value: string) => Promise<boolean>;
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
    variant = "default",
    button: initialButtonText,
    buttonClick,
  } = props;

  const labelVariants = cva(`block mb-2 text-sm font-medium`, {
    variants: {
      variant: {
        default: "text-gray-700 dark:text-white-500",
        pass: "text-green-700 dark:text-green-500",
        nonePass: "text-red-700 dark:text-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  const InputVariants = cva(`border text-sm rounded-lg block w-full p-2.5`, {
    variants: {
      variant: {
        default: "bg-gary-50 border-gray-500 text-gray-900",
        pass: "bg-green-50 border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-green-500",
        nonePass:
          "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  const PVariants = cva("mt-2 text-sm", {
    variants: {
      variant: {
        default: "text-gary-600 dark:text-gary-500",
        pass: "text-green-600 dark:text-green-500",
        nonePass: "text-red-600 dark:text-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  const [_inputValue, setInputValue] = useState("");
  const [debouncedInput, setDebouncedInput] = useState(_inputValue);
  const [_valiant, setValiant] = useState(variant);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(_inputValue);
    }, 1000);

    return () => clearTimeout(timer);
  }, [_inputValue]);

  useEffect(() => {
    if (debouncedInput === "") {
      setValiant("default");
    } else if (isRight(debouncedInput)) {
      setValiant("pass");
    } else {
      setValiant("nonePass");
    }
  }, [debouncedInput, isRight]);

  const [buttonText, setButtonText] = useState<string>(typeof initialButtonText === "string" ? initialButtonText : "");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleButtonClick = useCallback(async () => {
    setIsButtonDisabled(true);
    setButtonText("loading...");

    try {
      const result = !(await buttonClick?.(debouncedInput));
      setButtonText(result ? "사용가능" : "사용불가");
    } catch (error) {
      setButtonText("Error");
      console.error("Button click error:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  }, [buttonClick, debouncedInput]);

  useEffect(() => {
    if (typeof initialButtonText === "function") {
      const updateButtonText = async () => {
        try {
          const text = await initialButtonText();
          setButtonText(text);
        } catch (error) {
          console.error("Error updating button text:", error);
          setButtonText("Error");
        }
      };
      updateButtonText();
    }
  }, [initialButtonText]);

  useEffect(() => {
    if (typeof initialButtonText === "string") {
      setButtonText(initialButtonText);
    }
  }, [debouncedInput, initialButtonText]);

  return (
    <div>
      <div className="mb-6">
        <label htmlFor={`determineInput-${label}`} className={cn(labelVariants({ variant: _valiant }), className)}>
          {label ? label : "입력"} {isRequired ? "(필수)" : ""}
        </label>
        <div className="flex h-10">
          <input
            type={label.includes("비밀번호") ? "password" : "text"}
            id={`determineInput-${label}`}
            value={_inputValue}
            required={isRequired}
            width={inputWidth}
            className={cn(InputVariants({ variant: _valiant }), className)}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {buttonText && (
            <button
              type="button"
              onClick={handleButtonClick}
              disabled={isButtonDisabled}
              className={`bg-gray-500 border text-sm rounded-lg block min-w-20 p-2.5 ml-4 ${
                isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {buttonText}
            </button>
          )}
        </div>
        <p className={cn(PVariants({ variant: _valiant }), className)}>
          {isRight(debouncedInput) ? rightMessage : wrongMessage}
        </p>
      </div>
    </div>
  );
};

export default DetermineInput;
