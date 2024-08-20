import { useState, useEffect } from "react";
import { Gender, UserStatus, UserPermissions } from "#/apollo/mutation";
import { cn } from "#/utils/utils";
import { cva } from "class-variance-authority";

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
  variant?: "default" | "pass" | "nonePass";
}

const labelVariants = cva("block mb-2 text-sm font-medium", {
  variants: {
    variant: {
      default: "text-gray-900 dark:text-white",
      pass: " text-green-900",
      nonePass: " text-red-900",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
const selectVariants = cva("text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ", {
  variants: {
    variant: {
      default: "text-sm border border-gray-500 text-gray-900 ",
      pass: "text-sm border border-green-500 text-green-900 placeholder-green-700 dark:placeholder-green-500",
      nonePass: "text-sm border border-red-500 text-red-900 placeholder-red-700 dark:placeholder-red-500",
    },
    disable: {
      default: "text-sm ",
      disabled: "text-sm bg-gray-50 border text-gray-400",
    },
    defaultVariants: {
      variant: "default",
      disable: "default",
    },
  },
});
const Select = (props: SelectProps) => {
  const {
    isRight = () => true,
    variant = "default",
    placeholder,
    disabled = false,
    className,
    defaultValue,
    options,
    label,
    onChange,
  } = props;

  const [_value, setValue] = useState<ValueType>(defaultValue);
  const [_variant, setVariant] = useState(variant);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as ValueType;
    setValue(newValue);

    // onChange 콜백이 제공되면 호출
    if (onChange) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    if (placeholder) {
      setVariant("default");
    } else if (isRight(_value)) {
      setVariant("pass");
    } else {
      setVariant("nonePass");
    }
  }, [_value, defaultValue, isRight, placeholder]);
  return (
    <div className=" mb-6">
      <label htmlFor={`select-${label}`} className={cn(labelVariants({ variant: _variant }))}>
        {label}
      </label>
      <select
        id={`select-${label}`}
        defaultValue={placeholder}
        value={_value}
        onChange={handleChange}
        className={cn(selectVariants({ variant: _variant, disable: disabled ? "disabled" : "default" }), className)}
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
