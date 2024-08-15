import DetermineInput, { DetermineInputProps } from "#/common/DetermineInput";
import { useMutation } from "@apollo/client";
import { SIGN_IN_USER } from "#/apollo/mutation";
interface CustomDetermineInputProps
  extends Omit<DetermineInputProps, "isRight"> {
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
];

const SigninPage = () => {
  const [formState, setFormState] = useState<SigninType>({
    password: "",
    user_id: "",
  });

  const [signinFc, { data: signinUserData, loading, error }] =
    useMutation(SIGN_IN_USER);
  return <div></div>;
};

export default SigninPage;
