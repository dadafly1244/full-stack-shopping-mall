# FE

## 프로젝트 실행방법

### 로컬

1. fe 폴더로 이동. (`cd fe`)
2. env파일 생성

```
VITE_BE_URL="http://localhost:4000/uploads"
VITE_MAP_KEY="카카오map_key를 넣어주세요"
```

3. 터미널에서 `npm i` 실행
4. 백엔드가 실행되어 있는지 확인(be/readme.md를 참고)
5. `npm run dev`를 실행하고 다른 곳에서 사용하고 있지 않다면 브라우저에서 `http://localhost:5173/`로 접근.

## 프로젝트 설명

간단한 쇼핑몰 사이트 만들기.
프로젝트 기획, 디자인, 코딩을 모두 스스로 함.
프로젝트 기간: 39일 (약 2달)

## 기술 스택

- React.js
- TypeScript
- graphql
- tailwindcss.js
- apollo/client
- react-router-dom
- tailwind-merge
- react-kakao-maps-sdk
- vite
- ...

### 기능 설명

- 관리자

  - 기능 : 사이트 관리자, 판매자, test user를 가정하고 생성함.
  - id: `jc1515`, pw: `jc1515!!`으로 해당 기능 확인가능.
  - 구현 기능 : jwt token을 기반으로 관리자 권한을 가지고 있는 사용자만 관리자 페이지로 접근할 수 있고, 관리자페이지로 접근하는 버튼도 보이도록 설계함.

  - 사용자관리
    - 기능 : 사용자 조회, 옵션별 검색, 세부정보수정, 상태수정.
    - 구현기능 : 새로고침 시 페이지와 검색어 유지, 사용자 조회시 페이지네이션, 이메일 중복확인 기능 등을 중심적으로 개발함.
  - 상품관리
    - 기능 : 상품 조회, 상품 전체 및 옵션별 검색, 상품정보 조회 및 수정, 상품 상태 변경, 상품 카테고리 조회, 카테고리 생성, 카테고리 수정 및 삭제.
    - 구현기능 : 새로고침 시 페이지와 검색어 유지, 옵션에 상관 없는 전체 검색 기능 구현, 상품정보 조회 및 수정에서 이미지 원래 이미지로 되될리기 기능 구현, 카테고리를 참조하는 자식카테고리나 상품이 있는 경우 카테고리 삭제가 되지 않도록 구현. 다중 제품 삭제 기능 구현.
  - 주문관리
    - 기능: 주문 조회, 주문 상세 조회, 전체옵션 혹은 상태로 주문 검색, 주문 상태 변경
    - 구현기능: 주문확인전 상태일때만 주문취소 가능하게 구현, 주문조회시 페이지네이션, 주문 상세페이지에서 상품정보와 사용자 정보 및 배송 주소를 확인할 수 있게 구현
  - 상품 리뷰
    - 기능: 상품 리뷰 조회, 리뷰 작성, 대댓글 작성, 리뷰 삭제
    - 구현 기능: 리뷰를 조회, 작성, 삭제를 할 수 있음. 그리고 관리자인 경우에만 대댓글을 허용하여 사용자들의 리뷰에 답글을 작상할 수 있도록 하였음.

- 사용자

  - 기능: 사용자 정보 관리, 사이트 상품 구매, 장바구니 관리, 리뷰 작성, 주문 관리를 할 수 있다고 가정하고 생성함.
  - id: `wkdwl11`, pw: `wkdwl11!!` / id: `rnjsalscjf`, pw: `rnjsals11!!`/ id: `rnjsdbswls`, pw: `rnjsdbswls11!!` 으로 사용자 관련 기능 확인가능.
  - 구현 기능: 로그인한 사용자만이 상품구매, 장바구니 담기, 리뷰작성을 할 수 있게 구현했습니다. 또 자신이 작성한 리뷰만 수정할 수 있는 등의 기능을 구현

  - 사용자 정보 관리
    - 기능: 사용자 정보 수정
    - 구현 기능: 이름, 비밀번호, 이메일, 휴대폰번호, 성별을 변경할 수 있음. 이메일의 경우 중복확인 기능을 거쳐야 함. 사용자 계정 상태, 권한, 고유번호, 가입일, 최근 수정일을 알 수 있고 회원탈퇴를 할 수 있음. (회원 정지의 경우 관리자만 가능)
  - 장바구니 관리
    - 기능: 장바구니 조회, 장바구니 제품 수량 수정, 제룸 삭제, 제품 다중 삭제, 개별 주문 및 전체 주문, 가격 및 할인가격에 대한 정보 제공
    - 구현 기능: 장바구니의 경우 db에 저장을 하여서 로그아웃을 해도 사용자의 장바구니 정보를 저장할 수 있게 하였음. 그리고 장바구니에서 개별 주문과 전체주문이 가능하고, 개별 삭제 및 전체 삭제가 가능함. 주문을 한 제품의 경우 자동으로 장바구니에서 삭제되는 기능이 있음. 제품의 제고보다 많은 제품을 추가할 수 없게 되어있음. 그리고 가격에 대한 정보를 자동적으로 계산해서 제공함.
  - 주문 기능
    - 기능 : 주문서 페이지, 결제 확인창
    - 구현 기능: 주문서 페이지에서 주문하는 제품 목록 및 제품의 수량 가격을 표시하고 총 가격을 계산해서 나타냄. 향후에 제품의 가격이 바뀌더라도 주문 당시의 가격을 저장하여 착오가 생기지 않도록 함. 주소를 입력받기 위해서 kaako api를 연결하여 한국 주소를 정확하게 입력할 수 있도록 설계함. 결제의 경우 결제 확인 창으로 대체
  - 결제 내역
    - 기능: 장바구니 내역 조회, 세부 결제내역 페이지, 주문 취소.
    - 구현 기능: 결제한 제품혹은 장바구니 내역 조회. 해당 주문내역을 클릭하는 경우 세부 결제내역 페이지로 이동. 주문 확인 전 상태인 경우 주문 취소 버튼 활성화.
  - 상품 리뷰
    - 기능: 상품 리뷰 조회, 작성, 수정 기능
    - 구현 기능: 구매 여부와 상관 없이 상품에 대한 리뷰를 조회할 수 있고 로그인한 사용자의 경우 리뷰를 작성하고 자신이 작성한 리뷰의 경우 수정할 수 있음. (삭제는 관리자만 가능함.), 리뷰에는 별점 및 사진을 등록할 수 있음.

---

## 프로젝트에 대한 생각

- vite로 프로젝트를 처음부터 setting해 보고 싶었고, graphql과 ts를 써보며 빠르게 적응해보는 것이 이번 프로젝트의 목적이었습니다.
- vite의 경우 chatgpt가 next에서 remix로 리팩토링을 했다는 기사를 읽게 되었는데, remix가 vite 기반으로 좀더 빠르고 간편한 빌드 환경을 제공한다는 이야기가 있어서 vite를 선택하게 되었습니다. 향후에는 remix를 활용한 프로젝트도 도전해 보고 싶습니다.
- graphql과 apollo등 핵심기술 들이 처음 써보는 기술이었지만, 실제로 프로젝트를 만들어보면서 빠르게 기술에 적응해 볼 수 있었습니다.
- 기획과 ux 디자인을 직접 설계하면서 많은 부족함을 느꼈고, 향후 기회가 된다면 ux디자인과 관련해서는 더욱 공부를 하여 전문성을 확장하고 싶습니다. 또 기획에서도 더 많은 레퍼런스를 참고하여 더 자연스러운 서비스를 만들지 못한 부분이 아쉬움으로 남았습니다.

---

## !ERROR

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

---

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
