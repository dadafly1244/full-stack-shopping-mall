export const formatPhoneNumber = (phoneNumber: string): string => {
  // 숫자만 추출
  const cleaned = phoneNumber.replace(/[^0-9]/g, "");

  // 번호 형식이 올바른지 체크
  if (cleaned.length === 10) {
    // 10자리 번호일 경우 (예: 0101234567 -> 010-123-4567)
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  } else if (cleaned.length === 11) {
    // 11자리 번호일 경우 (예: 01012345678 -> 010-1234-5678)
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else {
    // 잘못된 번호 형식
    return phoneNumber;
  }
};

export const formatNumber = (input: string | number): string => {
  // 입력값이 숫자인지 확인
  const numericValue = typeof input === "number" ? input : Number(input.replace(/,/g, ""));

  if (isNaN(numericValue)) {
    throw new Error("Invalid input: Not a number");
  }

  // 숫자를 문자열로 변환하고 소수점 부분 분리
  const [integerPart, decimalPart] = numericValue.toString().split(".");

  // 정수 부분에 3자리마다 쉼표 추가
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 소수점 부분이 있으면 다시 붙이기
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};
