export const formatPhoneNumber = (phoneNumber: string): string => {
  // 숫자만 추출
  const cleaned = phoneNumber.replace(/[^0-9]/g, "");

  // 번호 형식이 올바른지 체크
  if (cleaned.length === 10) {
    // 10자리 번호일 경우 (예: 0101234567 -> 010-1234-5678)
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  } else if (cleaned.length === 11) {
    // 11자리 번호일 경우 (예: 01012345678 -> 010-1234-5678)
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else {
    // 잘못된 번호 형식
    return phoneNumber;
  }
};
