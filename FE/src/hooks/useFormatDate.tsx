import { useMemo } from "react";

type UseFormatYYYYMMDDArgs = {
  date: string | Date; // string 또는 Date 객체를 받을 수 있도록 확장
  locale?: string; // 로케일을 선택적으로 받음 (기본값: 'ko-KR')
  options?: Intl.DateTimeFormatOptions; // 날짜 형식 옵션
};

export const useFormatDate = ({
  date,
  locale = "ko-KR", // 기본 로케일 설정
  options = { year: "numeric", month: "2-digit", day: "2-digit" }, // 기본 포맷 옵션 설정
}: UseFormatYYYYMMDDArgs): string => {
  const formattedDate = useMemo(() => {
    // date가 string이라면 Date 객체로 변환
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    if (isNaN(parsedDate.getTime())) return "Invalid Date";

    // Intl.DateTimeFormat을 사용하여 날짜를 지정된 형식과 로케일로 포맷팅
    return new Intl.DateTimeFormat(locale, options).format(parsedDate);
  }, [date, locale, options]);

  return formattedDate;
};

// 사용법
// const formattedDate1 = useFormatYYYYMMDD({ date: "2024-09-27 00:25:03.338" }); // 기본 로케일 'ko-KR'
// const formattedDate2 = useFormatYYYYMMDD({
//   date: new Date(),
//   locale: "en-US", // 미국 로케일
//   options: { year: "numeric", month: "long", day: "numeric" }, // 예: September 27, 2024
// });
