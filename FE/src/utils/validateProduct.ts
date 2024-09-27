import DOMPurify from "dompurify";

const MIN_DESC_LENGTH = 10;
const MAX_DESC_LENGTH = 5000;

interface ValidationResult {
  isValid: boolean;
  message: string;
  sanitizedValue: string;
}

export const validateProductName = (
  name: string
): {
  isValid: boolean;
  message: string;
} => {
  const productNameRegex = /^[가-힣a-zA-Z0-9\s_.,-]+$/;

  if (!productNameRegex.test(name)) {
    return {
      isValid: false,
      message:
        "제품 이름에 허용되지 않는 문자가 포함되어 있습니다. 한글, 영문, 숫자, 공백, 밑줄(_), 점(.), 쉼표(,)만 사용할 수 있습니다.",
    };
  }

  if (name.length < 2 || name.length > 100) {
    return {
      isValid: false,
      message: "제품 이름은 2자 이상 100자 이하여야 합니다.",
    };
  }

  return {
    isValid: true,
    message: "유효한 제품 이름입니다.",
  };
};

export function validateProductDesc(desc: string): ValidationResult {
  const sanitizedDesc = DOMPurify.sanitize(desc, { ALLOWED_TAGS: [] });

  if (sanitizedDesc.length < MIN_DESC_LENGTH) {
    return {
      isValid: false,
      message: `상품 설명은 최소 ${MIN_DESC_LENGTH}자 이상이어야 합니다.`,
      sanitizedValue: sanitizedDesc,
    };
  }

  if (sanitizedDesc.length > MAX_DESC_LENGTH) {
    return {
      isValid: false,
      message: `상품 설명은 최대 ${MAX_DESC_LENGTH}자를 초과할 수 없습니다.`,
      sanitizedValue: sanitizedDesc,
    };
  }

  return {
    isValid: true,
    message: "",
    sanitizedValue: sanitizedDesc,
  };
}

const MIN_PRICE = 0;
const MAX_PRICE = 10_000_000_000; // 100억

export function validateAndFormatPrice(price: string | number): ValidationResult {
  // 입력값을 숫자로 변환
  const numericPrice = typeof price === "string" ? Number(price.replace(/,/g, "")) : price;

  // 숫자가 아닌 경우 처리
  if (isNaN(numericPrice)) {
    return {
      isValid: false,
      message: "유효한 숫자를 입력해주세요.",
      sanitizedValue: "",
    };
  }

  // 0 이하인 경우 처리
  if (numericPrice <= MIN_PRICE) {
    return {
      isValid: false,
      message: "가격은 0보다 커야 합니다.",
      sanitizedValue: numericPrice.toString(),
    };
  }

  // 100억을 초과하는 경우 처리
  if (numericPrice > MAX_PRICE) {
    return {
      isValid: false,
      message: "가격은 100억을 초과할 수 없습니다.",
      sanitizedValue: numericPrice.toString(),
    };
  }

  return {
    isValid: true,
    message: "",
    sanitizedValue: numericPrice.toString(),
  };
}

const MIN_REVIEW_LENGTH = 100;
const MAX_REVIEW_LENGTH = 5000;

export function validateReview(desc: string): ValidationResult {
  const sanitizedDesc = DOMPurify.sanitize(desc, { ALLOWED_TAGS: [] });

  if (sanitizedDesc.length < MIN_REVIEW_LENGTH) {
    return {
      isValid: false,
      message: `리뷰는 최소 ${MIN_REVIEW_LENGTH}자 이상이어야 합니다.`,
      sanitizedValue: sanitizedDesc,
    };
  }

  if (sanitizedDesc.length > MAX_REVIEW_LENGTH) {
    return {
      isValid: false,
      message: `상품 설명은 최대 ${MAX_REVIEW_LENGTH}자를 초과할 수 없습니다.`,
      sanitizedValue: sanitizedDesc,
    };
  }

  return {
    isValid: true,
    message: "",
    sanitizedValue: sanitizedDesc,
  };
}
