import { Input, Button } from "@material-tailwind/react";
import { useState, useEffect } from "react";

const Newsletter = () => {
  const isValidEmail = (email: string): boolean =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
  const [_inputValue, setInputValue] = useState("");
  const [debouncedInput, setDebouncedInput] = useState(_inputValue);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    setInputValue(inputValue);
  };

  const handleSubscribeButton = () => {
    alert("구독해 주셔서 감사합니다.");
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(_inputValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [_inputValue]);

  useEffect(() => {
    if (debouncedInput !== "") {
      const valid = isValidEmail(debouncedInput);
      if (valid) {
        setIsSuccess(true);
        setIsError(false);
      } else {
        setIsSuccess(false);
        setIsError(true);
      }
    } else {
      setIsSuccess(false);
      setIsError(false);
    }
  }, [debouncedInput]);
  return (
    <div className="flex justify-between max-w-screen-xl mb-28 ">
      <div className="flex-wrap justify-start content-center font-bold w-1/3 text-2xl">
        Subscribe to Our Newsletter
      </div>
      <div className="flex justify-end w-2/3 ml-auto">
        <Input
          label="Email"
          placeholder="email을 입력해 소식지를 받아보세요."
          crossOrigin={undefined}
          onChange={handleChange}
          error={isError}
          success={isSuccess}
          className="w-10 mr-4 rounded"
        />
        <div className="ml-8">
          <Button className="w-36 h-10 text-sm rounded" onClick={handleSubscribeButton}>
            구독하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
