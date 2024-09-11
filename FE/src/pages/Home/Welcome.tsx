import { Button, Typography, Input } from "@material-tailwind/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const Welcome = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = useState<string>(searchParams.get("search") || "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    searchParams.set("search", input);
    setSearchParams(searchParams);
    // TODO: 향후 search 관련 로직 추가
  };
  return (
    <div className="w-screen min-h-96 bg-gray-600 flex flex-col justify-center content-center ">
      <div className="mx-auto flex flex-col justify-center my-8">
        <Typography type="h2" className="text-center text-5xl font-extrabold mb-4">
          <div className="whitespace-nowrap"> Welcome to Infofla's</div>
          <span>Boutique</span>
        </Typography>
        <Typography type="h3" className=" text-center text-lg font-semibold mb-8">
          Explore the latest infofla's trends
        </Typography>
        <div className="flex flex-col justify-center content-center">
          <Input
            color="black"
            onChange={(e) => handleInputChange(e)}
            crossOrigin={undefined}
            className="bg-white w-full"
            placeholder="제품을 찾아보세요."
          />
          <Button onClick={(e) => handleSearch(e)} className="w-80 mt-4 mx-auto">
            검색
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
