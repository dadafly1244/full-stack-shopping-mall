import { Dispatch, SetStateAction } from "react";
import { Select, Option, Input, Button } from "@material-tailwind/react";

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
  const renderInputOrSelect = () => {
    if (selectedOption in predefinedOptions) {
      return (
        <div className="relative">
          <Select
            className="w-60"
            name={selectedOption}
            label={`${searchLabel[selectedOption as keyof searchLabelType]} 선택`}
            value={selectedOption2nd}
            onChange={(value) => {
              if (value) {
                onSelected2nd(value);
              }
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
          <Button onClick={onClickSearch} size="sm" className="!absolute -right-16 top-1 rounded">
            검색
          </Button>
        </div>
      );
    } else {
      return (
        <div className="relative flex w-fit gap-2">
          <Input
            type="search"
            label={`${searchLabel[selectedOption as keyof searchLabelType]} 검색...`}
            value={searchValue}
            onChange={(e) => onSearchValue(e.target.value)}
            className="pr-20"
            containerProps={{
              className: "min-w-[288px]",
            }}
            crossOrigin={undefined}
          />
          <Button onClick={onClickSearch} size="sm" className="!absolute right-1 top-1 rounded">
            검색
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="relative flex gap-4 max-w-screen-md mb-10">
      <Button onClick={onResetSearch} size="sm" variant="outlined" className="rounded">
        초기화
      </Button>
      <div className="w-56">
        <Select
          label="검색 옵션 선택"
          value={selectedOption}
          onChange={(value) => {
            if (value) {
              onSelect(value);
              onSearchValue("");
              onSelected2nd("");
            }
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
    </div>
  );
};

export default SearchUser;
