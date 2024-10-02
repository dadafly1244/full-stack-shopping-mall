import React, { useState, useEffect } from "react";
import { cn } from "#/utils/utils";
import { cva } from "class-variance-authority";
import { SelectProps, ValueType } from "#/utils/types";

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

const selectVariants = cva(
  "text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ",
  {
    variants: {
      variant: {
        default: "text-sm border border-gray-500 text-gray-900 ",
        pass: "text-sm border border-green-500 text-green-900 placeholder-green-700 dark:placeholder-green-500",
        nonePass:
          "text-sm border border-red-500 text-red-900 placeholder-red-700 dark:placeholder-red-500",
      },
      disable: {
        default: "text-sm ",
        disabled: "text-sm bg-gray-50 border text-gray-400",
      },
    },
    defaultVariants: {
      variant: "default",
      disable: "default",
    },
  }
);

const Select: React.FC<SelectProps> = ({
  isRight = () => true,
  variant = "default",
  placeholder,
  disabled = false,
  className,
  defaultValue,
  options,
  label,
  onChange,
}) => {
  const [value, setValue] = useState<ValueType>(
    defaultValue !== undefined ? defaultValue : placeholder ? "" : options[0]?.value
  );
  const [currentVariant, setVariant] = useState(variant);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
      if (onChange) {
        onChange(defaultValue);
      }
    }
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as ValueType;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    if (value === "" && placeholder) {
      setVariant("default");
    } else if (isRight(value)) {
      setVariant("pass");
    } else {
      setVariant("nonePass");
    }
  }, [value, isRight, placeholder]);

  return (
    <div className="mb-6">
      <label htmlFor={`select-${label}`} className={cn(labelVariants({ variant: currentVariant }))}>
        {label}
      </label>
      <select
        id={`select-${label}`}
        value={value}
        onChange={handleChange}
        className={cn(
          selectVariants({ variant: currentVariant, disable: disabled ? "disabled" : "default" }),
          className
        )}
        disabled={disabled}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;

// import { useState, useEffect } from "react";
// import { cn } from "#/utils/utils";
// import { cva } from "class-variance-authority";
// import { SelectProps, ValueType } from "#/utils/types";

// const labelVariants = cva("block mb-2 text-sm font-medium", {
//   variants: {
//     variant: {
//       default: "text-gray-900 dark:text-white",
//       pass: " text-green-900",
//       nonePass: " text-red-900",
//     },
//   },
//   defaultVariants: {
//     variant: "default",
//   },
// });
// const selectVariants = cva(
//   "text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ",
//   {
//     variants: {
//       variant: {
//         default: "text-sm border border-gray-500 text-gray-900 ",
//         pass: "text-sm border border-green-500 text-green-900 placeholder-green-700 dark:placeholder-green-500",
//         nonePass:
//           "text-sm border border-red-500 text-red-900 placeholder-red-700 dark:placeholder-red-500",
//       },
//       disable: {
//         default: "text-sm ",
//         disabled: "text-sm bg-gray-50 border text-gray-400",
//       },
//       defaultVariants: {
//         variant: "default",
//         disable: "default",
//       },
//     },
//   }
// );
// const Select = (props: SelectProps) => {
//   const {
//     isRight = () => true,
//     variant = "default",
//     placeholder,
//     disabled = false,
//     className,
//     defaultValue,
//     options,
//     label,
//     onChange,
//   } = props;

//   const [_value, setValue] = useState<ValueType>(defaultValue);
//   const [_variant, setVariant] = useState(variant);

//   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const newValue = e.target.value as ValueType;
//     setValue(newValue);

//     // onChange 콜백이 제공되면 호출
//     if (onChange) {
//       onChange(newValue);
//     }
//   };

//   useEffect(() => {
//     if (placeholder) {
//       setVariant("default");
//     } else if (isRight(_value)) {
//       setVariant("pass");
//     } else {
//       setVariant("nonePass");
//     }
//   }, [_value, defaultValue, isRight, placeholder]);
//   return (
//     <div className=" mb-6">
//       <label htmlFor={`select-${label}`} className={cn(labelVariants({ variant: _variant }))}>
//         {label}
//       </label>
//       <select
//         id={`select-${label}`}
//         defaultValue={placeholder}
//         value={_value}
//         onChange={handleChange}
//         className={cn(
//           selectVariants({ variant: _variant, disable: disabled ? "disabled" : "default" }),
//           className
//         )}
//       >
//         {placeholder && <option value="defaultValue">선택해 주세요.</option>}
//         {options.map((o) => {
//           return (
//             <option key={o.value} value={o.value} disabled={disabled}>
//               {o.label}
//             </option>
//           );
//         })}
//       </select>
//     </div>
//   );
// };

// export default Select;
