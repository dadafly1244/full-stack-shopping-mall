# BE

# mysql

## 사용 방법

- `.env`파일

```
DATABASE_URL="mysql://root:tree33@localhost:3306/ojd"
ACCESS_TOKEN_SECRET="c546a44da172ce41c1581be7ee7a3ff418cc327a0fc6b6c6a1e4ad622e0df237eac78d33a98dfa119a115e6d5ea45ae3b104add6dbd38881e002aa83a7676609"
REFRESH_TOKEN_SECRET="3654386a6585157fe2f9f4474598bb3ae0ec50bd6fe87500ed6000a88cdd2263c8255ae3914d81592bde968f7b49c9786306e0f5fc3d25044cd11f62b6b3991f"

```

- 실행 명령어

```shell
$ npm run starddt # 서버 실행
$ npx npx prisma migrate dev --name 스키마이름 # prisma 스키마 변경한 경우

```

### 설치 명령어

```shell
$ brew update
$ brew upgrade
$ brew install mysql
```

### db server 시작, 재시작, 종료

```shell
$ brew services start mysql
$ brew services restart mysql
$ brew services stop mysql
```

### mariaDB server 연결 및 mysql db 시작

```shell
$ sudo mysql -u root
password : macOS 비밀번호
```

```
MariaDB [(none)]> use mysql
```

### mariaDB mysql root 암호 변경

```
MariaDB [mysql]> ALTER USER root@localhost IDENTIFIED VIA mysql_native_password USING PASSWORD("비밀번호");
```

### mariaDB mysql user 생성, 권한 부여

```
MariaDB [(none)]> grant [권한 종류] on DB이름. 테이블 이름 to 사용자 이름@호스트 identified by ['비밀번호'];
```

사용자를 조회한 경우 다음과 같이 나옴

```
MariaDB [mysql]> select host, user, password from mysql.user;
```

![mysql table 사용자 조회](./readmeImages/사용자%20조회.png)

### mariaDB 새로운 database 생성

```
MariaDB [(none)]> CREATE DATABASE 데이터베이스이름
```

### prisma, nexus 사용방법

- 참고 공식문서
  - https://www.prisma.io/docs/getting-started/quickstart
  - https://graphql-nexus.github.io/nexus-prisma/docs/usage

### ACCESS_TOKEN_SECRET 생성하는 방법

```shell
$ openssl rand -hex 64
```

### prisma schema 변경한 경우

```shell
npx prisma migrate dev --name
```

---

## 프로젝트 설명

간단한 쇼핑몰 사이트 만들기.
프로젝트 기획, 디자인, 코딩을 모두 스스로 함.
프로젝트 기간: 39일 (약 2달)

### 기술스택

- Node.js
- express
- graphql
- apollo/server
- mysql
- nexus
- prisma
- ...

### 구현 기술 설명.

- 사용자 관리
  - 로그인, 로그아웃, id와 email 중복체크
  - 관리자: 사용자 조회, 수정, 검색
  - 사용자: 정보 조회, 수정, 회원탈퇴
- 상품 관리
  - 관리자: 전체 상품 조회, 단일 상품 조회, 검색, 제품 생성, 제품 상태 변경, 제품 정보 수정 제품 삭제
  - 사용자: homepage 상품 조회 api, 단일 상품 조회,
- 주문 관리
  - 관리자: 모든 주문 조회, 주문 검색, 주문 상태 변경, 주문 삭제, 주문 상태로 주문 검색,
  - 사용자: 전체 사용자 주문 조회, 사용자 주문 검색, 단건 사용자 주문 조회, 장바구니 전체 주문, 장바구니 속 제품 개별 주문, 주문 취소,
- 리뷰 관리
  - 관리자: 리뷰 생성(대댓글 달기), 리뷰 삭제(soft delete, hard delete)
  - 사용자: 리뷰 조회, 리뷰 생성, 리뷰 수정
- 장바구니 관리
  - 사용자: 장바구니 조회, 생성, 장바구니에 제품 추가, 장바구니 제품 수량 변경, 장바구니 제품 삭제
- 판매처 관리
  - 관리자: 모든 판매처 조회, id로 판매처 검색, 판매처 검색, 사업자번호 중복 체크, 판매처 생성, 판매처 수정, 판매처에 연관 상품 있는지 확인 후 판매처 삭제
- 카테고리 관리
  - 관리자: 전체 카테고리 조회, 단일 카테고리 조회, 카텐고리 이름 검색, 카테고리 깊이 3까지 생성, 같은 깊이의 카테고리 새로운 이름으로 합치는 기능, 카테고리 이름 변경기능, 카테고리 삭제 기능.

### 프로젝트를 하면서...
- 처음 erd와 달라진 부분이 좀 있다. cart의 경우 처음에 cart db만 만들었는데, 그렇게 하니까 제품이 하나밖에 추기되지 않아서 다른 코드를 더 찾아보니 cart와 cart Item이 둘다 필요한 것을 알게 되었다. 그래서 cart, order에 item table을 추가해서 관리하는 방식으로 문제를 해결하게 되었다. 
- api는 설계하였지만, fe에서 반영하지 못한 api가 다수 있어 많은 아쉬움이 남는다. 하지만 api의 경우 Altair GraphQL Client로 실패하는 케이스, 성공하는 케이스를 나누어 test를 거쳤다. 
- 다음에 be를 작성하게 된다면 test 코드와 api문서를 작성하고 싶다. 혼자서 api를 설계하고 fe코딩을 하는데에도 불구하고 매개변수 등을 한번에 정리해서 볼 수 있다면 더 좋을 것 같다. 
- [nexus](https://nexusjs.org/)를 사용하면서 나는 편한 점이 많다고 생각했는데, 뭔가 현업에서 많이 사용하지 않는 것 같아 nexus를 사용하지 않고도 be 코드 작성을 한번 도전해 보아야 겠다는 생긱이 들었다. 

## ERROR

1. `Object literal may only specify known properties, and 'authorize' does not exist in type 'NexusOutputFieldConfig<"Mutation", "withdrawal">'.ts(2353)`

사용자 정의 typings를 추가해서 해결했습니다. [참고](https://github.com/graphql-nexus/nexus/issues/327)

- ./typings/index.ts 파일 추가

```js
import { FieldAuthorizeResolver } from '@nexus/schema/dist/plugins/fieldAuthorizePlugin'

declare global {

  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
}
```

- ./tsconfig.json에 설정 추가

```js
 {
  "compilerOptions": {
    ...,
    "types": [
      // Required for custom typings  if using serverless-offline & serverless-typescript:
      "./typings"
    ],
  },
}
```

2. 다른 환경에서 prisma 실행하는 방법

```shell
npx prisma migrate deploy # 마이그레이션을 실행하여 데이터베이스 스키마를 최신 상태로 만들기
npx prisma generate # 새로운 스키마에 맞춰 Prisma 클라이언트를 업데이트
```

-

3. `ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)`에러

- 파일 경로 및 심볼릭 링크가 정확하지 않아서 발생한다고 함.
- mariadb를 지우고 다시 설치하는 것이 가장 확실한 방법...

- 해결방법

  - `$brew services stop mysql`
  - 만약 launchctl을 등록했다면, `sudo launchctl unload -w ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist` 내려주는 것이 필요
  - `brew uninstall --force mysql`
  - 설치경로 확인 : `which mysql` : /opt/homebrew/bin/mysql
  - 경로에 맞게 다음내용 지우기
    `shell 
sudo rm -rf /opt/homebrew/mysql
sudo rm -rf /opt/homebrew/bin/mysql
sudo rm -rf /opt/homebrew/var/mysql
sudo rm -rf /opt/homebrew/Cellar/mysql
sudo rm -rf /opt/homebrew/mysql*
sudo rm -rf /tmp/mysql.sock.lock
sudo rm -rf /tmp/mysqlx.sock.lock
sudo rm -rf /tmp/mysql.sock
sudo rm -rf /tmp/mysqlx.sock
sudo rm ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist
sudo rm -rf /Library/StartupItems/MySQLCOM
sudo rm -rf /Library/PreferencePanes/My*
`

- **완전 삭제이후 컴퓨터 재부팅**
- 재설치 : `brew install mysql`
- mysql 서비스 시작 : `brew services start mysql`
- 비번 없이 root 로그인 : `mysql -u root`
- root 비밀번호 설정하기: `mysql_secure_installation`( VALIDATE PASSWORD PLUGIN 설치여부 물어볼 때는 N(아니오)를 선택할 것.)

- [참고 블로그](<https://linked2ev.github.io/database/2021/06/11/MySQL,-MariaDB-ERROR-2002-(HY000)-Can't-connect-to-local-MySQL-server-through-socket-'tmp-mysql.sock'-(2)/>), [참고 블로그2](https://linked2ev.github.io/database/2021/04/15/MariaDB-3.-MariaDB-%EC%84%A4%EC%B9%98-for-Mac/), [참고3](https://velog.io/@delvering17/MariaDB-MariaDB-ERROR-2002-HY000-Cant-connect-to-local-server-through-socket-tmpmysql.sock-2)
  , [도움1](<https://github.com/rangyu/TIL/blob/master/mysql/MySQL-%EC%99%84%EC%A0%84-%EC%82%AD%EC%A0%9C%ED%95%98%EA%B3%A0-%EC%9E%AC%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0-(MacOS).md>), [도움2](https://velog.io/@dhengh0205/Mysql-%EC%99%84%EC%A0%84-%EC%82%AD%EC%A0%9C)

## cf. [참고글](https://jinozblog.tistory.com/118), [참고2](https://codemonkyu.tistory.com/entry/MariaDB-MariaDB-%EA%B4%80%EB%A6%AC-%EC%A0%91%EC%86%8D-%EB%B0%8F-%EA%B0%84%EB%8B%A8-%EC%82%AC%EC%9A%A9%EB%B2%95)

[prisma](https://www.prisma.io/docs/orm/overview/prisma-in-your-stack/graphql)에 참고할 글 많음

---
