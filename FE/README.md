# FE

## !ERROR

---

240816

1. Warning: Invalid DOM property `stroke-linecap`.
   Did you mean `strokeLinecap`?

- SVG 아이콘이 JSX 문법으로 맞지 않아서 뜨기 때문, HTML 보다 JSX 문법으로 맞쳐서 수정하면 해결, `stroke-width => strokeWidth`
- React에서 'class' 아니라 'className' 을 사용하는 이유: HTML에서 class는 요소의 클래스를 정의하는데 사용됨. JavaScript에서 class는 클래스 선언을 정의하는데 사용. React에서는 JavaScript와 HTML을 결합하므로 class를 사용하면 충돌이 발생할 수 있음

2. 오타

3. type 에러

- enum type이 숫자로 db에 넘어가는 문제
  함수를 선언해서 해결

```js
export const getEnumValue = (enumObj: any, enumValue: number) => {
  return enumObj[enumValue];
};
```

4. 향후 필요한 과제:

- 타입에 따라서 컴포넌트를 동적으로 설정하는 코드로 리팩토링

  - js로만 해당 코드를 작성해본 경험이 있어 ts로 작성하니 계속 type에러가 남.각 컴포넌트들의 타입을 일일이 다 설정해 줘야 한다는 것을 몰랐음. 확장성을 고려해서 설계후 타입선언하고 FormBase 만들예정.

- 스타일링
- 권한별 라우터 제한을 위한 컴포넌트 제작

---

240823

- 저번주에 해결이 필요하다고 생각한 과제 중 해결한 것 :

  - 권한별 라우터 제한을 위한 컴포넌트 제작
  - 스타일링(일부)
  - tsError

- 이번주 적용한 기능
  - 권한별로 방문할 수 있는 페이지 제한하는 기능
    - user: id: rlawldms, pw: rlawldms11!!의 경우 관리자 페이지 들어갈 수 없음
    - admin: id: jc1515 pw: jc1515!! 의 경우 관리자 페이지 들어갈 수 있음
  -

---

240826

- material-tailwind/react 라이브러리 type 에러나는 문제

```
 Type '{ children: Element[]; className: string; }' is missing the following properties from type 'Pick<NavbarProps, "children" | "className" | "color" | "translate" | "slot" | "style" | "title" | "onChange" | "shadow" | "onClick" | "key" | "defaultChecked" | "defaultValue" | ... 248 more ... | "blurred">': placeholder, onPointerEnterCapture, onPointerLeaveCapture
```

원인: 타입이 맞지 않아서 생기는 문제로 리액트 type을 특정 버전(예전버전)으로 되돌려야한다고 하는데, 그렇게 해도 문제가 해결되지 않았다.

해결방법
`custom.d.ts`파일에 다음과 같이 추가

```js
import "@material-tailwind/react";

declare module "@material-tailwind/react" {
  interface MaterialTailwindComponent {
    placeholder?: string;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
  }

  interface NavbarProps extends MaterialTailwindComponent {}
  interface ButtonProps extends MaterialTailwindComponent {}
  // ... 계속 에러나는 컴포넌트 추가... ㅠ ㅠ
}
```

이 해결방안의 한계점 : 에러가 나는 모든 컴포넌트를 extends를 시켜줘야 한다.
더 간편한 해결책이 있다면 그 방법으로 변경할 필요가 있어 보인다.

- [참고](https://stackoverflow.com/questions/78296875/typescript-error-using-material-tailwind-react-with-nextjs14)
