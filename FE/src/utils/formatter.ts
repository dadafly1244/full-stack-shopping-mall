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

//날짜가 일주일 이내인지 판단하는 함수
export const isWithinWeek = (createdAt: string | Date): boolean => {
  const now = new Date();

  // createdAt이 문자열이면 Date 객체로 변환합니다
  const createdDate = typeof createdAt === "string" ? new Date(createdAt) : createdAt;

  // 일주일을 밀리초로 계산 (7일 * 24시간 * 60분 * 60초 * 1000밀리초)
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

  // 현재 시간과 생성 시간의 차이를 계산
  const differenceInMs = now.getTime() - createdDate.getTime();

  return differenceInMs <= oneWeekInMs;
};

export const isSignificantDiscount = (sale: number | undefined, price: number): boolean => {
  if (!sale) return false;
  // 가격이 음수인 경우를 방지
  if (sale < 0 || price <= 0) {
    throw new Error("Sale and price must be non-negative, and price must be greater than zero.");
  }

  // 할인율 계산
  const discountRate = (price - sale) / price;

  // 30% 이상 할인되었는지 확인 (0.3은 30%를 의미)
  return discountRate >= 0.3;
};

export const calculateDiscountPercentage = (sale: number | undefined, price: number): number => {
  if (!sale) return 0;
  // 가격이 유효한지 확인
  if (price <= 0 || sale < 0) {
    throw new Error("Price must be greater than zero and sale price must be non-negative.");
  }

  // 할인 금액이 원래 가격보다 큰 경우 처리
  if (sale > price) {
    throw new Error("Sale price cannot be greater than the original price.");
  }

  // 할인율 계산
  const discountRate = (price - sale) / price;

  // 백분율로 변환하고 소수점 둘째 자리까지 반올림
  return Math.round(discountRate * 100 * 100) / 100;
};
