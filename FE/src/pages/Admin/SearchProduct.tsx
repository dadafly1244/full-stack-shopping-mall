import React from "react";
import { Select, Option, Input, Button } from "@material-tailwind/react";

interface SearchUserProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  field: string;
  onFieldChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

const searchFields = {
  all: "전체",
  id: "아이디",
  name: "이름",
  desc: "설명",
  status: "상태",
  categoryName: "카테고리",
  is_deleted: "삭제 여부",
};

const SearchUser: React.FC<SearchUserProps> = ({
  searchTerm,
  onSearchTermChange,
  field,
  onFieldChange,
  onSearch,
  onReset,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onSearchTermChange(value);
  };
  const renderInput = () => {
    if (field === "is_deleted") {
      return (
        <Select
          label="삭제 여부 선택"
          value={searchTerm}
          onChange={(value) => value && onSearchTermChange(value)}
        >
          <Option value="true">삭제됨</Option>
          <Option value="false">삭제되지 않음</Option>
        </Select>
      );
    } else if (field === "status") {
      return (
        <Select
          label="상태 선택"
          value={searchTerm}
          onChange={(value) => value && onSearchTermChange(value)}
        >
          <Option value="AVAILABLE">이용 가능</Option>
          <Option value="DISCONTINUED">단종</Option>
          <Option value="OUT_OF_STOCK">재고 없음</Option>
          <Option value="PROHIBITION_ON_SALE">판매 금지</Option>
          <Option value="TEMPORARILY_OUT_OF_STOCK">일시 품절</Option>
        </Select>
      );
    } else {
      return (
        <Input
          type="search"
          label={`${searchFields[field as keyof typeof searchFields]} 검색...`}
          value={searchTerm}
          onChange={handleChange}
          className="pr-20 w-20 h-10"
          crossOrigin={undefined}
          containerProps={{
            className: "min-w-[288px]",
          }}
        />
      );
    }
  };

  return (
    <div className="flex gap-4 max-w-screen-md">
      <div className="flex gap-4">
        <Button onClick={onReset} size="sm" variant="outlined" className="w-20 h-10 rounded">
          초기화
        </Button>
        <Select
          label="검색 필드 선택"
          value={field}
          onChange={(value) => {
            console.log(22, value);
            if (value === "all") {
              onFieldChange("");
              onSearchTermChange("");
            } else {
              onFieldChange(value as string);
              onSearchTermChange("");
            }
          }}
        >
          {Object.entries(searchFields).map(([key, value]) => (
            <Option key={key} value={key}>
              {value}
            </Option>
          ))}
        </Select>
      </div>
      <div className="flex gap-4 items-end">
        {renderInput()}
        <Button onClick={onSearch} size="sm" className="w-20 h-10 rounded">
          검색
        </Button>
      </div>
    </div>
  );
};

export default SearchUser;
