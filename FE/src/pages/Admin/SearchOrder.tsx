import React from "react";
import { Select, Option, Input, Button } from "@material-tailwind/react";
import { OrderStatus } from "#/utils/types";

interface SearchUserProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  field: string;
  onFieldChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

const searchFields = {
  id: "전체",
  status: "상태",
};

const OrderSearchComponent: React.FC<SearchUserProps> = ({
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
    if (field === "status") {
      return (
        <Select
          label="상태 선택"
          value={searchTerm}
          onChange={(value) => value && onSearchTermChange(value)}
          className="!max-w-[288px]"
          containerProps={{
            className: "min-w-[288px] max-w-[288px]",
          }}
        >
          <Option value={OrderStatus.READY_TO_ORDER}>주문 확인 전</Option>
          <Option value={OrderStatus.ORDER}>주문</Option>
          <Option value={OrderStatus.DELIVERED}>배송중</Option>
          <Option value={OrderStatus.CANCELLED}>주문 취소</Option>
          <Option value={OrderStatus.REFUND}>환불 완료</Option>
          <Option value={OrderStatus.UNKNOWN}>상세불명</Option>
        </Select>
      );
    } else {
      return (
        <Input
          type="search"
          label={`주문번호, 사용자이름, 이메일, 주소로 검색...`}
          value={searchTerm}
          onChange={handleChange}
          className="w-20 h-10"
          crossOrigin={undefined}
          containerProps={{
            className: "min-w-[288px] max-w-[288px]",
          }}
        />
      );
    }
  };

  return (
    <div className="flex w-full justify-end gap-2 mb-4 ">
      <div className="flex gap-2">
        <Select
          label="검색 필드 선택"
          value={field}
          onChange={(value) => {
            onFieldChange(value as string);
            onSearchTermChange("");
          }}
          className="!max-w-[8rem]"
          containerProps={{
            className: "min-w-[8rem] max-w-[8rem]",
          }}
        >
          {Object.entries(searchFields).map(([key, value]) => (
            <Option key={key} value={key}>
              {value}
            </Option>
          ))}
        </Select>
      </div>
      <div className="flex gap-2 items-end">
        {renderInput()}
        <Button onClick={onReset} size="sm" variant="outlined" className="w-20 h-10 rounded">
          초기화
        </Button>
        <Button onClick={onSearch} size="sm" className="w-20 h-10 rounded">
          검색
        </Button>
      </div>
    </div>
  );
};

export default OrderSearchComponent;
