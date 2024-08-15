import { twJoin } from "tailwind-merge";
import { useState } from "react";
import { Gender, UserStatus, UserPermissions } from "#/apollo/mutation";

type ValueType = string | Gender | UserStatus | UserPermissions;

export interface SelectProps {
  key?: string;
  label: string;
  placeholder?: string;
  defaultValue: ValueType;
  options: { value: ValueType; label: string }[];
  onChange?: (value: ValueType) => void;
  disabled?: boolean;
  isRight?: (value: ValueType) => boolean;
  className?: string; // 추가 스타일을 위한 클래스명
}
const Select = (props: SelectProps) => {
  const {
    isRight = () => true,
    placeholder,
    disabled,
    className,
    defaultValue,
    options,
    label,
    onChange,
  } = props;

  const [_value, setValue] = useState<ValueType>(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as ValueType;
    setValue(newValue);

    // onChange 콜백이 제공되면 호출
    if (onChange) {
      onChange(newValue);
    }
  };
  return (
    <div className="mb-6 mx-auto">
      <label
        htmlFor={`select-${label}`}
        className={
          (twJoin(
            "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          ),
          isRight(_value) ? " text-green-900" : " text-red-900")
        }
      >
        {label}
      </label>
      <select
        id={`select-${label}`}
        defaultValue={placeholder}
        value={_value}
        onChange={handleChange}
        className={twJoin(
          "bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ",
          className,
          disabled && "bg-gray-50 border text-gray-400",
          isRight(_value)
            ? "border-green-500 text-green-900 placeholder-green-700 dark:placeholder-green-500"
            : "border-red-500 text-red-900 placeholder-red-700 dark:placeholder-red-500"
        )}
      >
        {placeholder && <option value="defaultValue">선택해 주세요.</option>}
        {options.map((o) => {
          return (
            <option key={o.value} value={o.value} disabled={disabled}>
              {o.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
