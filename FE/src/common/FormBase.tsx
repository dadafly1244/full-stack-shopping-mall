// import { useRef } from "react";
// import DetermineInput from "#/common/DetermineInput";
// import SelectBox from "#/common/SelectBox";

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
