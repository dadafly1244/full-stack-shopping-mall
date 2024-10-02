import { UPDATE_USER_My_PROFILE, WITHDRAWAL_USER } from "#/apollo/mutation";
import { CHECK_EMAIL, CHECK_ID, GET_SIGN_IN_USER_INFO } from "#/apollo/query";
import Breadcrumb from "#/common/Breadcrumb";
import ConfirmationDialog from "#/common/ConfirmationDialog";
import DetermineInput from "#/common/DetermineInput";
import NotificationDialog from "#/common/NotificationDialog";
import SelectBox from "#/common/SelectBox";
import { useFormatDate } from "#/hooks/useFormatDate";
import { formatPhoneNumber } from "#/utils/formatter";
import {
  CustomUserDetermineInputProps,
  CustomUserSelectProps,
  FormItem,
  Gender,
  myProfileType,
  UserPermissions,
  UserStatus,
} from "#/utils/types";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Spinner } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initUserInfo = {
  created_at: "",
  updated_at: "",
  id: "",
  user_id: "",
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  gender: Gender.PREFER_NOT_TO_SAY,
  phone_number: "",
  status: UserStatus.ACTIVE,
  permissions: UserPermissions.USER,
};
const USER_STATUS = {
  ACTIVE: "활성",
  INACTIVE: "탈퇴",
  SUSPENDED: "정지",
};
const MyProfile = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<myProfileType>(initUserInfo);
  const [originalState, setOriginalState] = useState<myProfileType>(initUserInfo);
  const [withdrawalFormState, setWithdrawalFormState] = useState({
    id: "",
    password: "",
  });
  const [isInfoErrorOpen, setIsInfoErrorOpen] = useState(false);
  const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);
  const [isUpdateErrorOpen, setIsUpdateErrorOpen] = useState(false);
  const [userInfoFc, { data: userInfo, error, loading }] = useLazyQuery(GET_SIGN_IN_USER_INFO);

  useEffect(() => {
    userInfoFc({
      onCompleted: () => {
        if (userInfo?.myProfile) {
          setFormState(userInfo.myProfile);
          setOriginalState(userInfo.myProfile);
        }
      },
    });
  }, []);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (userInfo?.myProfile) {
      setFormState(userInfo?.myProfile);
      setOriginalState(userInfo?.myProfile);
    }
  }, [userInfo, userInfoFc]);

  const [checkIdFc] = useLazyQuery(CHECK_ID);
  const [checkEmailFc] = useLazyQuery(CHECK_EMAIL);

  const [deleteFc, { data: deletedUserInfo, loading: deletedLoading, error: deleteError }] =
    useMutation(WITHDRAWAL_USER);

  const [updateFc, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_USER_My_PROFILE);

  useEffect(() => {
    if (error) {
      setIsInfoErrorOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (updateError) {
      setIsUpdateErrorOpen(true);
    }
  }, [updateError]);

  const myProfileFrom: FormItem[] = [
    {
      type: "determineInput",
      key: "name",
      label: "이름",
      placeholder: "이름을 한글 또는 알파벳으로 1~20자 사이로 입력하세요.",
      wrongMessage: "다시 입력하세요.",
      rightMessage: " ",
      isRight: (name: string): boolean => /^[a-zA-Zㄱ-ㅎ가-힣]{1,20}$/.test(name.trim()),
      isRequired: false,
    },
    {
      type: "determineInput",
      key: "user_id",
      label: "ID",
      placeholder: "ID를 알파벳 6~20자 사이로 입력하세요.",
      wrongMessage: "다시 입력하세요.",
      rightMessage: " ",
      isRight: (id: string): boolean => /^[a-zA-Z0-9]{6,20}$/.test(id.trim()),
      isRequired: false,
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
      isRequired: false,
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
      isRequired: false,
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

  // const handleUpdateUserInfo = async () => {
  //   const validationResults = await Promise.all(
  //     Object.keys(formState).map(async (key) => {
  //       const typedKey = key as keyof myProfileType;
  //       const value = formState[typedKey];

  //       const field = myProfileFrom.find((f) => f.key === typedKey);
  //       if (field && field.type === "determineInput") {
  //         if (typedKey === "confirmPassword") {
  //           if (value === "") return true;
  //           return isPasswordMatch(value as string);
  //         } else if (typedKey === "user_id") {
  //           return (await canUseThisId(value as string)) && field.isRight(value as string);
  //         } else if (typedKey === "email") {
  //           return !canUseThisEmail(value as string) && field.isRight(value as string);
  //         } else if (typedKey === "phone_number") {
  //           // 빈 값인 경우 검증하지 않음
  //           if (value === "") return true;
  //           return /^01([0|1|6|7|8|9])-?\d{3,4}-?\d{4}$/.test(formatPhoneNumber(value as string));
  //         }
  //         return field.isRight(value as string);
  //       }
  //       return true;
  //     })
  //   );

  //   if (validationResults.some(Boolean)) {
  //     try {
  //       updateFc({
  //         variables: {},
  //         onCompleted: () => {},
  //       });
  //     } catch (error) {
  //       console.error("Error during update: ", error);
  //     }
  //   } else {
  //     alert("형식을 다시 확인해주세요.");
  //   }
  // };

  const handleUpdateUserInfo = async () => {
    const changedFields = Object.keys(formState).filter(
      (key) => formState[key as keyof myProfileType] !== originalState[key as keyof myProfileType]
    );

    const validationResults = await Promise.all(
      changedFields.map(async (key) => {
        const typedKey = key as keyof myProfileType;
        const value = formState[typedKey];

        const field = myProfileFrom.find((f) => f.key === typedKey);
        if (field && field.type === "determineInput") {
          if (typedKey === "confirmPassword") {
            if (value === "") return true;
            return isPasswordMatch(value as string);
          } else if (typedKey === "user_id") {
            return (await canUseThisId(value as string)) && field.isRight(value as string);
          } else if (typedKey === "email") {
            return (await canUseThisEmail(value as string)) && field.isRight(value as string);
          } else if (typedKey === "phone_number") {
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
        const updateData = changedFields.reduce((acc, key) => {
          const typedKey = key as keyof myProfileType;
          if (formState[typedKey] !== undefined) {
            acc[typedKey] = formState[typedKey];
          }
          return acc;
        }, {} as Partial<myProfileType>);

        updateFc({
          variables: updateData,
          onCompleted: () => {
            setOriginalState(formState);
            alert("프로필이 성공적으로 업데이트되었습니다.");

            userInfoFc({
              onCompleted: () => {
                if (userInfo?.myProfile) {
                  setFormState(userInfo.myProfile);
                  setOriginalState(userInfo.myProfile);
                }
              },
            });
          },
        });
      } catch (error) {
        console.error("Error during update: ", error);
        alert("프로필 업데이트 중 오류가 발생했습니다.");
      }
    } else {
      alert("변경된 필드의 형식을 다시 확인해주세요.");
    }
  };

  const handleOpenWithdrawalDialog = () => {
    setIsWithdrawalOpen(true);
  };

  const handleCloseWithdrawalDialog = () => {
    setIsWithdrawalOpen(false);
  };

  const handleWithdrawal = async () => {
    try {
      if (withdrawalFormState?.id && withdrawalFormState?.password) {
        await deleteFc({
          variables: {
            user_id: withdrawalFormState.id,
            password: withdrawalFormState.password,
          },
          onCompleted: () => {
            localStorage.setItem("token", "");
            localStorage.setItem("refresh_token", "");
            setIsWithdrawalOpen(false);
            alert(
              `회원에서 탈퇴했습니다. ${deletedUserInfo?.name}님 다음에 또 저희 쇼핑몰을 이용해주세요.`
            );
            navigate("/");
          },
        });
      }
    } catch (error) {
      setIsWithdrawalOpen(false);
      alert(`회원탈퇴에 실패했습니다.${!deleteError?.message ? " " : deleteError?.message}`);
    }
  };
  const handleInputChange = (key: keyof myProfileType, value: myProfileType | string) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleChangeWithdrawalIdForm = (value: string) => {
    setWithdrawalFormState((prev) => ({
      ...prev,
      id: value,
    }));
  };

  const handleChangeWithdrawalPasswordForm = (value: string) => {
    setWithdrawalFormState((prev) => ({
      ...prev,
      password: value,
    }));
  };

  const createdAt = useFormatDate({ date: formState.created_at });
  const updatedAt = useFormatDate({ date: formState.updated_at });

  return (
    <div>
      <NotificationDialog
        isOpen={isInfoErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다. 사용자 정보를 불러올 수 없습니다.`}
        onClose={() => setIsInfoErrorOpen(false)}
      />
      <NotificationDialog
        isOpen={isUpdateErrorOpen}
        title="ERROR!!"
        message={`에러가 발생했습니다. 사용자 정보 수정에 에러가 발생했습니다.`}
        onClose={() => setIsUpdateErrorOpen(false)}
      />
      <ConfirmationDialog
        isOpen={isWithdrawalOpen}
        message="정말 탈퇴하시겠습니까? 아이디와 비밀번호를 입력해주세요."
        children={
          <div className="w-full flex flex-col">
            {deletedLoading && <Spinner />}
            <DetermineInput
              key="user_id"
              label="ID"
              placeholder="ID를 알파벳 6~20자 사이로 입력하세요."
              wrongMessage="다시 입력하세요."
              rightMessage=" "
              isRight={(id: string): boolean => /^[a-zA-Z0-9]{6,20}$/.test(id.trim())}
              isRequired
              className=""
              onChange={(value) => handleChangeWithdrawalIdForm(value)}
            />
            <DetermineInput
              key="password"
              label="비밀번호"
              placeholder="영어 소문자, 숫자, 특수문자(!@#$%^&*) 포함해서 8~30 글자 입력하세요."
              wrongMessage="올바른 비밀번호를 입력해주세요."
              rightMessage=" "
              isRight={(password: string): boolean =>
                /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,30}$/.test(password.trim())
              }
              isRequired
              className=""
              onChange={(value) => handleChangeWithdrawalPasswordForm(value)}
            />
          </div>
        }
        onConfirm={handleWithdrawal}
        onCancel={handleCloseWithdrawalDialog}
      />
      {loading && <Spinner />}
      <div className="py-5">
        <Breadcrumb />
      </div>
      {formState && (
        <div className="relative w-full border border-solid border-gray-200 rounded-lg p-8">
          <div className="text-lg font-bold text-gray-600">
            <span className="text-gray-800">{originalState.name}</span>님, 환영합니다.
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm font-bold text-gray-700 border-t border-b border-solid border-gray-200 py-4">
            <div>사용자 고유 번호 : {formState.id}</div>
            <div>권한 : {formState.permissions === "ADMIN" ? "관리자" : "사용자"}</div>
            <div>계정 상태 : {USER_STATUS[formState.status]}</div>
            <div>가입일 : {createdAt}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-red-800 py-4">
              <span>
                * 정보를 수정하고 싶다면, 수정하고 싶은 정보를 변경한 후 수정 버튼을 눌러 주세요. *
              </span>
            </div>
            <form onSubmit={handleUpdateUserInfo}>
              <div className="grid grid-cols-2 gap-4">
                {myProfileFrom.map((item) => {
                  if (item.type === "determineInput") {
                    const determineItem = item as CustomUserDetermineInputProps;
                    return (
                      <DetermineInput
                        key={determineItem.key}
                        label={determineItem.label}
                        value={formState[determineItem.key]}
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
                    const selectItem = item as CustomUserSelectProps;
                    return (
                      <SelectBox
                        key={selectItem.key}
                        label={selectItem.label}
                        defaultValue={originalState[selectItem.key]}
                        options={selectItem.options}
                        onChange={(v) => handleInputChange(selectItem.key, v)}
                      />
                    );
                  }
                  return null;
                })}
                <div className="flex justify-end items-end p-7">
                  <span className="text-xs p-1">최근 사용자 정보 수정일: {updatedAt}</span>
                  <Button type="submit" className="px-8 py-3 rounded-md" loading={updateLoading}>
                    <span>수정</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div className="absolute p-2 bottom-1 left-1">
            <Button
              className="text-xs font-thin"
              variant="text"
              onClick={handleOpenWithdrawalDialog}
            >
              회원 탈퇴
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
