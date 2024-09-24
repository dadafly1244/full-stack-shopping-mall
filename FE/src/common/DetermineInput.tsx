import { ReactElement, useState, useEffect, useCallback, useRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "#/utils/utils";
import { DetermineInputProps } from "#/utils/types";
import { Button, Input } from "@material-tailwind/react";
import { formatPhoneNumber } from "#/utils/formatter";

const DetermineInput = (props: DetermineInputProps): ReactElement => {
  const {
    label = "입력",
    placeholder = "입력해주세요",
    wrongMessage = "다시 입력해주세요.",
    rightMessage = " ",
    isRight,
    isRequired = false,
    className,
    onChange,
    inputWidth,
    variant = "default",
    button: initialButtonText,
    buttonClick,
    value,
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

  const [_inputValue, setInputValue] = useState(value ? value : "");
  const [debouncedInput, setDebouncedInput] = useState(_inputValue);
  const [_valiant, setValiant] = useState(variant);
  const inputRef = useRef(null);

  const [buttonText, setButtonText] = useState<string>(String(initialButtonText));
  const [buttonStatue, setButtonStatus] = useState<null | "error" | "loading" | "success">(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [message, setMessage] = useState<null | string>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    if (label === "휴대폰번호") {
      inputValue = formatPhoneNumber(inputValue);
    }

    if (onChange) {
      onChange(inputValue);
    }

    setInputValue(inputValue);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(_inputValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [_inputValue]);

  useEffect(() => {
    if (debouncedInput === "") {
      setValiant("default");
      setButtonStatus(null);
      setMessage("");
    } else if (isRight(debouncedInput)) {
      setValiant("pass");
      setButtonStatus("success");
      if (rightMessage && typeof rightMessage === "string") {
        setMessage(rightMessage);
      } else if (typeof rightMessage !== "string") {
        const words = rightMessage(debouncedInput) as string;
        rightMessage(words);
      }
    } else {
      setValiant("nonePass");
      setButtonStatus("error");
      if (typeof wrongMessage === "string") {
        setMessage(wrongMessage);
      } else if (typeof wrongMessage !== "string") {
        const words = wrongMessage(debouncedInput) as string;
        setMessage(words);
      }
    }
  }, [debouncedInput, isRight, rightMessage, wrongMessage]);

  const handleButtonClick = useCallback(async () => {
    setIsButtonDisabled(true);
    setButtonStatus("loading");

    try {
      const result = !(await buttonClick?.(debouncedInput));
      if (result && isRight(debouncedInput)) {
        setButtonText("사용가능");
        setButtonStatus("success");
        if (rightMessage && typeof rightMessage === "string") {
          setMessage(rightMessage);
        } else if (typeof rightMessage !== "string") {
          const words = rightMessage(debouncedInput) as string;
          rightMessage(words);
        }
      } else {
        setButtonText("사용불가");

        setButtonStatus("error");
        if (typeof wrongMessage === "string") {
          setMessage(wrongMessage);
        } else if (typeof wrongMessage !== "string") {
          const words = wrongMessage(debouncedInput) as string;
          setMessage(words);
        }
      }
    } catch (error) {
      setButtonText("Error");
      console.error("Button click error:", error);
      setButtonText(String(initialButtonText));
    } finally {
      setIsButtonDisabled(false);
    }
  }, [buttonClick, debouncedInput, isRight, initialButtonText, wrongMessage, rightMessage]);

  useEffect(() => {
    if (typeof initialButtonText === "function") {
      const updateButtonText = async () => {
        try {
          const text = await initialButtonText();
          setButtonText(text);
          setButtonStatus(null);
        } catch (error) {
          console.error("Error updating button text:", error);
          setButtonStatus("error");
        }
      };
      updateButtonText();
    }
  }, [initialButtonText]);

  useEffect(() => {
    if (typeof initialButtonText === "string") {
      setButtonText(initialButtonText);
      setButtonStatus(null);
    }
  }, [debouncedInput, initialButtonText]);

  return (
    <div>
      <div className="mb-6">
        <label
          htmlFor={`determineInput-${label}`}
          className={cn(labelVariants({ variant: _valiant }), className)}
        >
          {label ? label : "입력"} {isRequired ? "(필수)" : ""}
        </label>
        <div className="flex h-10">
          <Input
            ref={inputRef}
            type={label.includes("비밀번호") ? "password" : "text"}
            id={`determineInput-${label}`}
            value={_inputValue}
            required={isRequired}
            width={inputWidth}
            className={cn("placeholder:opacity-100", className)}
            placeholder={placeholder}
            onChange={handleChange}
            crossOrigin={undefined}
            error={buttonStatue === "error"}
            success={buttonStatue === "success"}
          />
          {initialButtonText && (
            <Button
              type="button"
              onClick={handleButtonClick}
              disabled={isButtonDisabled}
              loading={buttonStatue === "loading"}
              size="sm"
              color={
                buttonStatue === "success"
                  ? "green"
                  : buttonStatue === "error"
                  ? "red"
                  : "blue-gray"
              }
              className="rounded w-32 ml-2 min-w-20"
            >
              {buttonText}
            </Button>
          )}
        </div>
        <p className={cn("text-sm  text-gray-500", className, message ? "block" : "hidden")}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default DetermineInput;
