import { Dispatch, SetStateAction } from "react";
import { Select, Option, Input, Button } from "@material-tailwind/react";
import { useSearchParams } from "react-router-dom";

interface UserSearchComponentProps {
  selectedOption: string;
  onSelect: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string;
  onSearchValue: React.Dispatch<React.SetStateAction<string>>;
  selectedOption2nd: string;
  onSelected2nd: Dispatch<SetStateAction<string>>;
  onClickSearch: () => void;
  onResetSearch: () => void;
}
interface searchLabelType {
  name: string;
  email: string;
  status: string;
  gender: string;
  user_id: string;
  phone_number: string;
  permissions: string;
}

const searchLabel = {
  name: "이름",
  email: "이메일",
  status: "상태",
  gender: "성별",
  user_id: "아이디",
  phone_number: "휴대폰번호",
  permissions: "권한",
};

type PredefinedOptionsType = {
  status: { ACTIVE: string; INACTIVE: string; SUSPENDED: string };
  permissions: { ADMIN: string; USER: string };
  gender: { MALE: string; FEMALE: string; OTHER: string; PREFER_NOT_TO_SAY: string };
};

const predefinedOptions: PredefinedOptionsType = {
  status: { ACTIVE: "활성화", INACTIVE: "탈퇴", SUSPENDED: "정지" },
  permissions: { ADMIN: "관리자", USER: "사용자" },
  gender: {
    MALE: "남성",
    FEMALE: "여성",
    OTHER: "기타",
    PREFER_NOT_TO_SAY: "선택안함",
  },
};

const SearchUser: React.FC<UserSearchComponentProps> = ({
  selectedOption,
  onSelect,
  searchValue,
  onSearchValue,
  selectedOption2nd,
  onSelected2nd,
  onClickSearch,
  onResetSearch,
}) => {
  const [, setSearchParams] = useSearchParams();

  const renderInputOrSelect = () => {
    if (selectedOption in predefinedOptions) {
      return (
        <div className="relative">
          <Select
            className="w-60 !max-w-[10rem] !min-w-40"
            name={selectedOption}
            label={`${searchLabel[selectedOption as keyof searchLabelType]} 선택`}
            value={selectedOption2nd}
            onChange={(value) => {
              if (value) {
                onSelected2nd(value);
              }
            }}
            containerProps={{
              className: "!min-w-[10rem] !max-w-[10rem]",
            }}
          >
            {Object.entries(predefinedOptions[selectedOption as keyof PredefinedOptionsType]).map(
              ([key, value]) => {
                return (
                  <Option key={key} value={value}>
                    {value}
                  </Option>
                );
              }
            )}
          </Select>
        </div>
      );
    } else {
      return (
        <div className="relative flex w-40 gap-2">
          <Input
            type="search"
            label={`${searchLabel[selectedOption as keyof searchLabelType]} 검색...`}
            value={searchValue}
            onChange={(e) => onSearchValue(e.target.value)}
            className=" !max-w-[10rem]  !min-w-[10rem]"
            containerProps={{
              className: "!min-w-[10rem] !max-w-[10rem]",
            }}
            crossOrigin={undefined}
          />
        </div>
      );
    }
  };

  return (
    <div className="relative flex gap-4 mb-10">
      <div className="w-40">
        <Select
          label="검색 옵션 선택"
          value={selectedOption}
          onChange={(value) => {
            if (value) {
              onSelect(value);
              onSearchValue("");
              onSelected2nd("");
              const newSearchParams = new URLSearchParams();
              setSearchParams(newSearchParams);
            }
          }}
          className="!max-w-[10rem] !min-w-[10rem]"
          containerProps={{
            className: "!min-w-[10rem] !max-w-[10rem]",
          }}
        >
          {Object.entries(searchLabel).map(([key, value]) => (
            <Option key={key} value={key}>
              {value}
            </Option>
          ))}
        </Select>
      </div>
      {selectedOption && renderInputOrSelect()}
      <div className="flex justify-center gap-3">
        <Button onClick={onResetSearch} size="sm" variant="outlined" className="rounded">
          초기화
        </Button>
        <Button onClick={onClickSearch} size="sm" className="rounded">
          검색
        </Button>
      </div>
    </div>
  );
};

export default SearchUser;
