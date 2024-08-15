#

## ERROR

1. Warning: Invalid DOM property `stroke-linecap`.
   Did you mean `strokeLinecap`?

- SVG 아이콘이 JSX 문법으로 맞지 않아서 뜨기 때문, HTML 보다 JSX 문법으로 맞쳐서 수정하면 해결, `stroke-width => strokeWidth`
- React에서 'class' 아니라 'className' 을 사용하는 이유: HTML에서 class는 요소의 클래스를 정의하는데 사용됨. JavaScript에서 class는 클래스 선언을 정의하는데 사용. React에서는 JavaScript와 HTML을 결합하므로 class를 사용하면 충돌이 발생할 수 있음
