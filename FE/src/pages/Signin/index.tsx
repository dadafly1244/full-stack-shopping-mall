import DetermineInput from "#/common/DetermineInput";
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { SIGN_IN_USER } from "#/apollo/mutation";
import { useSetRecoilState } from "recoil";
import { userState } from "#/store/atoms";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { DetermineInputProps } from "#/utils/types";
import { Card, CardHeader, Typography, CardBody, Button } from "@material-tailwind/react";
import { cn } from "#/utils/utils";
interface CustomDetermineInputProps extends Omit<DetermineInputProps, "isRight"> {
  isRight: (value: string) => boolean;
  key: keyof SigninType;
  type: "determineInput";
}

interface SigninType {
  password: string;
  user_id: string;
}

const signinForm: CustomDetermineInputProps[] = [
  {
    type: "determineInput",
    key: "user_id",
    label: "ID",
    placeholder: "ID를 알파벳 6~20자 사이로 입력하세요.",
    wrongMessage: "다시 입력하세요.",
    isRight: (id: string): boolean => /^[a-zA-Z0-9]{6,20}$/.test(id.trim()),
    isRequired: true,
  },
  {
    type: "determineInput",
    key: "password",
    label: "비밀번호",
    placeholder: "영어 소문자, 숫자, 특수문자(!@#$%^&*) 포함해서 8~30 글자 입력하세요.",
    wrongMessage: "올바른 비밀번호를 입력해주세요.",
    isRight: (password: string): boolean =>
      /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,30}$/.test(password.trim()),
    isRequired: true,
  },
];

const SigninPage = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<SigninType>({
    password: "",
    user_id: "",
  });

  const setUserState = useSetRecoilState(userState);

  const [signinFc, { data: signinUserData, loading, error }] = useMutation(SIGN_IN_USER);

  const token = localStorage.getItem("token") || "";
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  useEffect(() => {
    if (signinUserData) {
      const { token, refresh_token, user } = signinUserData.signin;

      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("token", token);

      setUserState({
        name: user.name,
        userId: user.userId,
        gender: user.gender,
      });

      navigate("/");
    }
  }, [signinUserData, setUserState, navigate]);

  const handleSignin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      signinFc({
        variables: {
          password: formState.password,
          user_id: formState.user_id,
        },
      });
    } catch (error) {
      console.error("Error during signin: ", error);
    }
  };

  return (
    <>
      {
        <Card shadow={false} className="min-w-96 mx-auto">
          <CardHeader shadow={false} floated={false} className="text-center">
            <Typography variant="h1" color="blue-gray" className="mb-4 !text-3xl lg:text-4xl">
              Sign In
            </Typography>
            <Typography className="!text-gray-600 text-[18px] font-normal ">
              로그인 해주세요.
            </Typography>
          </CardHeader>
          <CardBody>
            <form className="flex flex-col" onSubmit={handleSignin}>
              <div className="grid mb-6 ">
                {signinForm.map((item) => {
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
                  }
                })}
              </div>
              {error && <p style={{ color: "red" }}>An error occurred: {error.message}</p>}
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className={cn(
                  "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-4/5 sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
                  !loading ? "cursor-pointer" : "cursor-not-allowed"
                )}
              >
                로그인
              </Button>
            </form>
            <div className="flex mt-5">
              <p className="text-sm text-gray-800">아직 계정이 없다면 회원가입을 눌러주세요.</p>
              <Link
                to="/signup"
                className={
                  "text-gray-500 focus:ring-4 focus:outline-none focus:text-black ml-10 font-medium rounded-lg text-sm w-full sm:w-auto text-center "
                }
              >
                회원가입
              </Link>
            </div>
          </CardBody>
        </Card>
      }
    </>
  );
};

export default SigninPage;
