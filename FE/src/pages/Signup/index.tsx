import { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { SIGN_UP_USER } from "#/apollo/mutation";
import { CHECK_ID, CHECK_EMAIL } from "#/apollo/query";

import { formatPhoneNumber } from "#/utils/formatter";
import DetermineInput from "#/common/DetermineInput";
import SelectBox from "#/common/SelectBox";
import { useNavigate } from "react-router-dom";
import { cn } from "#/utils/utils";
import { useSetRecoilState } from "recoil";
import { userState } from "#/store/atoms";
import {
  SignupType,
  FormItem,
  CustomDetermineInputProps,
  CustomSelectProps,
  Gender,
  UserStatus,
  UserPermissions,
} from "#/utils/types";
import { Button, Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<SignupType>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    user_id: "",
    gender: Gender.PREFER_NOT_TO_SAY,
    phone_number: "",
    status: UserStatus.ACTIVE,
    permissions: UserPermissions.USER,
  });

  const token = localStorage.getItem("token") || "";
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  const setUserState = useSetRecoilState(userState);

  const [signupFc, { data: signupUserData, loading, error }] = useMutation(SIGN_UP_USER);
  const [checkIdFc] = useLazyQuery(CHECK_ID);
  const [checkEmailFc] = useLazyQuery(CHECK_EMAIL);

  const signupForm: FormItem[] = [
    {
      type: "determineInput",
      key: "name",
      label: "이름",
      placeholder: "이름을 한글 또는 알파벳으로 1~20자 사이로 입력하세요.",
      wrongMessage: "다시 입력하세요.",
      rightMessage: " ",
      isRight: (name: string): boolean => /^[a-zA-Zㄱ-ㅎ가-힣]{1,20}$/.test(name.trim()),
      isRequired: true,
    },
    {
      type: "determineInput",
      key: "user_id",
      label: "ID",
      placeholder: "ID를 알파벳 6~20자 사이로 입력하세요.",
      wrongMessage: "다시 입력하세요.",
      rightMessage: " ",
      isRight: (id: string): boolean => /^[a-zA-Z0-9]{6,20}$/.test(id.trim()),
      isRequired: true,
      button: "중복확인",
      buttonClick: async () => {
        try {
          const result = await checkIdFc({ variables: { user_id: formState.user_id } });
          return result.data.isDuplicated.duplicated;
        } catch (error) {
          console.error("Error checking ID:", error);
          return false;
        }
      },
    },
    {
      type: "determineInput",
      key: "password",
      label: "비밀번호",
      placeholder:
        "비밀번호를 영어 소문자, 숫자, 특수문자(!@#$%^&*) 포함해서 8~30 글자 입력하세요.",
      wrongMessage:
        "비밀번호를 영어 소문자, 숫자, 특수문자(!@#$%^&*) 포함해서 8~30 글자 입력하세요.",
      rightMessage: "사용가능합니다.",
      isRight: (password: string): boolean =>
        /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,30}$/.test(password.trim()),
      isRequired: true,
    },
    {
      type: "determineInput",
      key: "confirmPassword",
      label: "비밀번호 확인",
      placeholder: "비밀번호를 다시 입력하세요.",
      wrongMessage: "비밀번호가 일치하지 않습니다.",
      rightMessage: "비밀번호가 일치합니다.",
      isRight: (confirmPassword: string): boolean =>
        confirmPassword === formState.password &&
        /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,30}$/.test(confirmPassword.trim()),
      isRequired: true,
    },
    {
      type: "determineInput",
      key: "email",
      label: "email",
      placeholder: "email 주소를 입력하세요.",
      wrongMessage: "바른 형식의 email 주소를 입력하세요.",
      rightMessage: " ",
      isRight: (email: string): boolean =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim()),
      isRequired: true,
      button: "중복확인",
      buttonClick: async (email: string) => {
        try {
          const result = await checkEmailFc({ variables: { email: email } });
          return result.data.isDuplicated.duplicated;
        } catch (error) {
          console.error("Error checking email:", error);
          return false;
        }
      },
    },
    {
      type: "determineInput",
      key: "phone_number",
      label: "휴대폰번호",
      placeholder: "010-0000-0000",
      wrongMessage: "올바른 형식의 전화번호를 입력해주세요",
      rightMessage: " ",
      isRight: (phone: string): boolean => /^01([0|1|6|7|8|9])-?\d{3,4}-?\d{4}$/.test(phone.trim()),
      formatter: formatPhoneNumber,
      isRequired: false,
    },
    {
      type: "selectInput",
      key: "gender",
      label: "성별",
      defaultValue: "PREFER_NOT_TO_SAY",
      options: [
        { value: "MALE", label: "남성" },
        { value: "FEMALE", label: "여성" },
        { value: "OTHER", label: "기타" },
        { value: "PREFER_NOT_TO_SAY", label: "선택안함" },
      ],
    },
  ];

  const isPasswordMatch = (confirmPassword: string): boolean => {
    return (
      confirmPassword === formState.password &&
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,30}$/.test(confirmPassword.trim())
    );
  };

  const canUseThisId = async (id: string) => {
    try {
      const result = await checkIdFc({ variables: { user_id: id } });
      return !result.data?.isDuplicated.duplicated;
    } catch (error) {
      throw new Error(`에러발생 ${error}`);
    }
  };
  const canUseThisEmail = async (email: string) => {
    try {
      const result = await checkEmailFc({ variables: { email } });
      if (result.error) {
        console.error("GraphQL error:", result.error);
        throw new Error(`GraphQL error: ${result.error.message}`);
      }
      if (!result.data) {
        console.error("No data returned:", result);
        throw new Error("No data returned from server");
      }
      return !result.data.isDuplicated.duplicated;
    } catch (error) {
      console.error("Error checking email:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (signupUserData?.signup?.user?.name) {
      alert(`${signupUserData.signup.user.name}님 회원가입을 환영합니다.`);

      const { token, refresh_token, user } = signupUserData.signup;

      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("token", token);

      setUserState({
        name: user.name,
        userId: user.userId,
        gender: user.gender,
      });
      navigate("/");
    }
  }, [signupUserData, setUserState, navigate]);

  const isDetermineInput = (item: FormItem): item is CustomDetermineInputProps => {
    return item.type === "determineInput";
  };

  type valueType = string | Gender | UserStatus | UserPermissions;

  const handleInputChange = (key: keyof SignupType, value: valueType) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.preventDefault();

    // 모든 필드 검증
    const validationResults = await Promise.all(
      Object.keys(formState).map(async (key) => {
        const typedKey = key as keyof SignupType;
        const value = formState[typedKey];

        // signupForm에서 필드 찾기
        const field = signupForm.find((f) => f.key === typedKey);
        if (field && isDetermineInput(field)) {
          if (typedKey === "confirmPassword") {
            return isPasswordMatch(value as string);
          } else if (typedKey === "user_id") {
            return (await canUseThisId(value as string)) && field.isRight(value as string);
          } else if (typedKey === "email") {
            return (await canUseThisEmail(value as string)) && field.isRight(value as string);
          } else if (typedKey === "phone_number") {
            // 빈 값인 경우 검증하지 않음
            if (value === "") return true;
            return /^01([0|1|6|7|8|9])-?\d{3,4}-?\d{4}$/.test(formatPhoneNumber(value as string));
          }
          return field.isRight(value as string);
        }
        return true;
      })
    );

    if (validationResults.every(Boolean)) {
      try {
        await signupFc({
          variables: {
            email: formState.email,
            password: formState.password,
            name: formState.name,
            user_id: formState.user_id,
            gender: formState.gender,
            phone_number: formState.phone_number,
            permissions: formState.permissions,
            status: formState.status,
          },
        });
      } catch (error) {
        console.error("Error during signup: ", error);
      }
    } else {
      alert("형식을 다시 확인해주세요.");
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>An error occurred: {error.message}</p>}
      <Card shadow={false} className=" md:px-24 md:py-14 mt-10 py-8">
        <CardHeader shadow={false} floated={false} className="text-center">
          <Typography variant="h1" color="blue-gray" className="mb-4 !text-3xl lg:text-4xl">
            Sign Up
          </Typography>
          <Typography className="!text-gray-600 text-[18px] font-normal ">
            회원가입을 환영합니다.
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSignup}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              {signupForm.map((item) => {
                if (item.type === "determineInput") {
                  const determineItem = item as CustomDetermineInputProps;
                  return (
                    <DetermineInput
                      key={determineItem.key}
                      label={determineItem.label}
                      placeholder={determineItem.placeholder}
                      wrongMessage={determineItem.wrongMessage}
                      rightMessage={determineItem.rightMessage}
                      isRight={determineItem.isRight}
                      isRequired={determineItem.isRequired}
                      className={determineItem.className}
                      button={determineItem.button}
                      buttonClick={determineItem.buttonClick}
                      onChange={(value) => handleInputChange(item.key, value)}
                    />
                  );
                } else if (item.type === "selectInput") {
                  const selectItem = item as CustomSelectProps;
                  return (
                    <SelectBox
                      key={selectItem.key}
                      label={selectItem.label}
                      defaultValue={formState[selectItem.key]}
                      options={selectItem.options}
                      onChange={(v) => handleInputChange(selectItem.key, v)}
                    />
                  );
                }
                return null;
              })}
            </div>
            <Button
              type="submit"
              className={cn(
                `bg-blue-500 text-white border text-sm rounded-lg block min-w-48 p-2.5 w-full `
              )}
            >
              회원가입
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignupPage;
