import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  // SIGN_UP_USER,
  Gender,
  UserStatus,
  UserPermissions,
} from "#/apollo/mutation";

import { formatPhoneNumber } from "#/utils/formatter";
// import { FormGenerator } from "#/common/FormBase";
import DetermineInput, { DetermineInputProps } from "#/common/DetermineInput";
import SelectBox, { SelectProps } from "#/common/SelectBox";

interface CustomDetermineInputProps
  extends Omit<DetermineInputProps, "isRight"> {
  isRight: (value: string) => boolean;
  key: keyof SignupType;
  type: "determineInput" | "selectInput";
  formatter?: (a: string) => string;
}

interface CustomSelectProps extends SelectProps {
  key: keyof SignupType;
  type: "determineInput" | "selectInput";
}

type FormItem = CustomDetermineInputProps | CustomSelectProps;
interface SignupType {
  email: string;
  password: string;
  name: string;
  user_id: string;
  gender: Gender;
  phone_number: string;
  status: UserStatus;
  permissions: UserPermissions;
}

const signupForm: FormItem[] = [
  {
    type: "determineInput",
    key: "name",
    label: "이름",
    placeholder: "이름을 입력해주세요.",
    wrongMessage: "1~20자 사이로 입력하세요.",
    rightMessage: "% ^ ^ %",
    isRight: (name: string): boolean =>
      /^[a-zA-Zㄱ-ㅎ가-힣]{1,20}$/.test(name.trim()),
    isRequired: true,
  },
  {
    type: "determineInput",
    key: "user_id",
    label: "ID",
    placeholder: "ID를 입력하세요.",
    wrongMessage: "6~20자 사이로 입력하세요.",
    rightMessage: "% ^ ^ %",
    isRight: (id: string): boolean => /^[a-zA-Z0-9]{6,20}$/.test(id.trim()),
    isRequired: true,
  },
  {
    type: "determineInput",
    key: "password",
    label: "비밀번호",
    placeholder: "비밀번호를 입력하세요.",
    wrongMessage:
      "영어 소문자, 숫자, 특수문자(!@#$%^&*) 포함해서 8~30 글자 입력하세요.",
    rightMessage: "% ^ ^ %",
    isRight: (password: string): boolean =>
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,30}$/.test(
        password.trim()
      ),
    isRequired: true,
  },
  {
    type: "determineInput",
    key: "email",
    label: "email",
    placeholder: "email 주소를 입력하세요.",
    wrongMessage: "바른 email 주소를 입력하세요.",
    rightMessage: "% ^ ^ %",
    isRight: (email: string): boolean =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim()),
    isRequired: true,
  },
  {
    type: "determineInput",
    key: "phone_number",
    label: "휴대폰번호",
    placeholder: "휴대폰 번호를 입력하세요.",
    wrongMessage: "바른 휴대폰 번호를 입력하세요.",
    rightMessage: "% ^ ^ %",
    isRight: (phone: string): boolean =>
      /^01([0|1|6|7|8|9])-?\d{3,4}-?\d{4}$/.test(
        formatPhoneNumber(phone.trim())
      ),
    formatter: formatPhoneNumber,
    isRequired: false,
  },
  {
    type: "selectInput",
    key: "gender",
    label: "성별",
    defaultValue: Gender.PREFER_NOT_TO_SAY,
    options: [
      { value: Gender.MALE, label: "남성" },
      { value: Gender.FEMALE, label: "여성" },
      { value: Gender.OTHER, label: "기타" },
      { value: Gender.PREFER_NOT_TO_SAY, label: "선택안함" },
    ],
  },
];

const SignupPage = () => {
  const [formState, setFormState] = useState<SignupType>({
    email: "",
    password: "",
    name: "",
    user_id: "",
    gender: Gender.PREFER_NOT_TO_SAY,
    phone_number: "",
    status: UserStatus.ACTIVE,
    permissions: UserPermissions.USER,
  });

  const [signupFc, { data: signupUserData, loading, error }] =
    useMutation(SIGN_UP_USER);

  const handleSignup = (e: React.MouseEvent<HTMLSelectElement>) => {
    e.preventDefault();
    signupFc({
      variables: {
        name: formState.name,
        user_id: formState.user_id,
        email: formState.email,
        password: formState.password,
        gender: formState.gender,
        phone_number: formState.phone_number,
        permissions: formState.permissions,
      },
    });
  };

  return (
    <div>
      <form onSubmit={handleSignup}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          {signupForm.map((item) => {
            if (item.type === "determineInput") {
              const determineItem = item as DetermineInputProps;
              return (
                <DetermineInput
                  key={determineItem.key}
                  label={determineItem?.label}
                  placeholder={determineItem?.placeholder as string}
                  wrongMessage={determineItem?.wrongMessage as string}
                  rightMessage={determineItem?.rightMessage as string}
                  isRight={(value: string): boolean =>
                    (item.isRight as (value: string) => boolean)(value)
                  }
                  isRequired={determineItem?.isRequired}
                  className={determineItem?.className}
                  onChange={(value) => {
                    setFormState((prev) => ({
                      ...prev,
                      [item.key]: value,
                    }));
                  }}
                />
              );
            } else if (item.type === "selectInput") {
              const selectItem = item as SelectProps;
              return (
                <SelectBox
                  key={selectItem.key}
                  label={selectItem.label}
                  defaultValue={formState[selectItem.key as keyof SignupType]}
                  options={selectItem.options}
                  onChange={(v) => {
                    setFormState((prev) => ({
                      ...prev,
                      [item.key]: v,
                    }));
                  }}
                />
              );
            }
          })}

          {/* <div>
            <label
              htmlFor="company"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              gender
            </label>
            <input
              type="text"
              id="company"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Flowbite"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Phone number
            </label>
            <input
              type="tel"
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="123-45-678"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              required
            />
          </div> */}
        </div>
        {/* <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="john.doe@company.com"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="•••••••••"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirm_password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Confirm password
          </label>
          <input
            type="password"
            id="confirm_password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="•••••••••"
            required
          />
        </div>
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
              required
            />
          </div>
          <label
            htmlFor="remember"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            I agree with the{" "}
            <a
              href="#"
              className="text-blue-600 hover:underline dark:text-blue-500"
            >
              terms and conditions
            </a>
            .
          </label>
        </div> */}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
