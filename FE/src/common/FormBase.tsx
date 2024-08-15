// import { useRef } from "react";
// import DetermineInput from "#/common/DetermineInput";
// import SelectBox from "#/common/SelectBox";

// 조건부가 아니라 동적으로 컴포넌트 할당하고 싶었음.

// const FORMS = {
//   determineInput: DetermineInput,
//   select: SelectBox,
// };

// export const FormGenerator = (type: string, formProps) => {
//   const { current: Component } = useRef(FORMS[type]);

//   if (type in FORMS) {
//     return <Component {...formProps} />;
//   }
//   return null;
// };

//향후에 이런식으로 수정할 예정
// import React from "react";

// // 컴포넌트 타입 정의
// interface InputField {
//   type: "input";
//   key: string;
//   label: string;
//   placeholder?: string;
// }

// interface SelectField {
//   type: "select";
//   key: string;
//   label: string;
//   options: { value: string; label: string }[];
// }

// interface RadioField {
//   type: "radio";
//   key: string;
//   label: string;
//   options: { value: string; label: string }[];
// }

// // Field 타입은 다양한 필드 타입을 하나로 묶습니다.
// type Field = InputField | SelectField | RadioField;

// // Form 필드 배열
// const formFields: Field[] = [
//   { type: "input", key: "name", label: "Name", placeholder: "Enter your name" },
//   {
//     type: "select",
//     key: "country",
//     label: "Country",
//     options: [
//       { value: "us", label: "United States" },
//       { value: "ca", label: "Canada" },
//     ],
//   },
//   {
//     type: "radio",
//     key: "gender",
//     label: "Gender",
//     options: [
//       { value: "male", label: "Male" },
//       { value: "female", label: "Female" },
//     ],
//   },
// ];

// // 컴포넌트 정의
// const InputComponent = ({ label, placeholder }: InputField) => (
//   <div>
//     <label>{label}</label>
//     <input type="text" placeholder={placeholder} />
//   </div>
// );

// const SelectComponent = ({ label, options }: SelectField) => (
//   <div>
//     <label>{label}</label>
//     <select>
//       {options.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const RadioComponent = ({ label, options, key }: RadioField) => (
//   <div>
//     <label>{label}</label>
//     {options.map((option) => (
//       <div key={option.value}>
//         <input type="radio" id={option.value} name={key} value={option.value} />
//         <label htmlFor={option.value}>{option.label}</label>
//       </div>
//     ))}
//   </div>
// );

// // COMPONENT 객체에 필드 타입을 컴포넌트에 매핑
// const COMPONENT = {
//   input: InputComponent,
//   select: SelectComponent,
//   radio: RadioComponent,
// };

// // DynamicForm 컴포넌트
// const DynamicForm = () => {
//   return (
//     <form>
//       {formFields.map((field) => {
//         const Component = COMPONENT[field.type];
//         return <Component key={field.key} {...field} />;
//       })}
//     </form>
//   );
// };

// export default DynamicForm;
