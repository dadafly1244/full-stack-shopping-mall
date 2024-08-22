import { UPDATE_USER_ADMIN, Gender, UserStatus, UserPermissions } from "#/apollo/mutation";
import {
  UpdateFormItem,
  UserType,
  CustomUserDetermineInputProps,
  CustomUserSelectProps,
} from "#/utils/types";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CHECK_ID, CHECK_EMAIL } from "#/apollo/query";
import { formatPhoneNumber } from "#/utils/formatter";
import { cn } from "#/utils/utils";
import DetermineInput from "#/common/DetermineInput";
import SelectBox from "#/common/SelectBox";

import { useState, useEffect } from "react";

const UpdateUserForm = ({ user, onClose }: { user: UserType; onClose: () => void }) => {
  const [formState, setFormState] = useState<UserType>(user);
  const [updateFc, { data: updateUserData, loading, error }] = useMutation(UPDATE_USER_ADMIN);
  const [checkIdFc] = useLazyQuery(CHECK_ID);
  const [checkEmailFc] = useLazyQuery(CHECK_EMAIL);
  const updateForm: UpdateFormItem[] = [
    {
      type: "determineInput",
      key: "name",
      label: "이름",
      placeholder: "이름을 입력해주세요.",
      wrongMessage: "1~20자 사이로 입력하세요.",
      rightMessage: "% ^ ^ %",
      isRight: (name: string): boolean => /^[a-zA-Zㄱ-ㅎ가-힣]{1,20}$/.test(name.trim()),
    },
    {
      type: "determineInput",
      key: "user_id",
      label: "ID",
      placeholder: "ID를 입력하세요.",
      wrongMessage: "6~20자 사이로 입력하세요.",
      rightMessage: "% ^ ^ %",
      isRight: (id: string): boolean => /^[a-zA-Z0-9]{6,20}$/.test(id.trim()),
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
      key: "email",
      label: "email",
      placeholder: "email 주소를 입력하세요.",
      wrongMessage: "바른 email 주소를 입력하세요.",
      rightMessage: "% ^ ^ %",
      isRight: (email: string): boolean =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim()),
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
      placeholder: "휴대폰 번호를 입력하세요.",
      wrongMessage: "바른 휴대폰 번호를 입력하세요.",
      rightMessage: "% ^ ^ %",
      isRight: (phone: string): boolean =>
        /^01([0|1|6|7|8|9])-?\d{3,4}-?\d{4}$/.test(formatPhoneNumber(phone.trim())),
      formatter: formatPhoneNumber,
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

  const canUseThisId = async (id: string) => {
    const result = await checkIdFc({ variables: { id: id } });
    return !!result.data?.isDuplicated.duplicated;
  };

  const canUseThisEmail = async (email: string) => {
    const result = await checkEmailFc({ variables: { email: email } });
    return !!result.data?.isDuplicated.duplicated;
  };
  useEffect(() => {
    if (updateUserData) {
      console.log(updateUserData);
    }
  }, [updateUserData]);

  const isDetermineInput = (item: UpdateFormItem): item is CustomUserDetermineInputProps => {
    return item.type === "determineInput";
  };

  type valueType = string | Gender | UserStatus | UserPermissions;

  const handleInputChange = (key: keyof UserType, value: valueType) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 모든 필드 검증
    const validationResults = await Promise.all(
      Object.keys(formState).map(async (key) => {
        const typedKey = key as keyof UserType;
        const value = formState[typedKey];

        // signupForm에서 필드 찾기
        const field = updateForm.find((f) => f.key === typedKey);
        if (field && isDetermineInput(field)) {
          if (typedKey === "user_id") {
            return !(await canUseThisId(value as string)) && field.isRight(value as string);
          } else if (typedKey === "email") {
            return !(await canUseThisEmail(value as string)) && field.isRight(value as string);
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

    if (validationResults.some(Boolean)) {
      try {
        await updateFc({
          variables: {
            id: formState.id,
            email: formState?.email,
            name: formState?.name,
            user_id: formState?.user_id,
            gender: formState?.gender,
            phone_number: formState?.phone_number,
            permissions: formState?.permissions,
          },
        });
        onClose();
      } catch (error) {
        console.error("Error during update: ", error);
      }
    } else {
      alert("형식을 다시 확인해주세요.");
    }
  };
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>An error occurred: {error.message}</p>}
      <form onSubmit={handleUpdate}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          {updateForm.map((item) => {
            if (item.type === "determineInput") {
              const determineItem = item as CustomUserDetermineInputProps;
              return (
                <DetermineInput
                  key={determineItem.key}
                  label={determineItem.label}
                  placeholder={formState[determineItem.key]}
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
              const selectItem = item as CustomUserSelectProps;
              return (
                <SelectBox
                  key={selectItem.key}
                  label={selectItem.label}
                  defaultValue={selectItem.key}
                  options={selectItem.options}
                  onChange={(v) => handleInputChange(selectItem.key, v)}
                />
              );
            }
            return null;
          })}
        </div>
        <button
          type="submit"
          className={cn(
            `bg-blue-500 text-white border text-sm rounded-lg block min-w-20 p-2.5 ml-4`
          )}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateUserForm;