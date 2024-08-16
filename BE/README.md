# BE

# mariaDB

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
$ brew install mariadb
```

### db server 시작, 재시작, 종료

```shell
$ brew services start mariadb
$ brew services restart mariadb
$ brew services stop mariadb
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

-

cf. [참고글](https://jinozblog.tistory.com/118), [참고2](https://codemonkyu.tistory.com/entry/MariaDB-MariaDB-%EA%B4%80%EB%A6%AC-%EC%A0%91%EC%86%8D-%EB%B0%8F-%EA%B0%84%EB%8B%A8-%EC%82%AC%EC%9A%A9%EB%B2%95)

---

[prisma](https://www.prisma.io/docs/orm/overview/prisma-in-your-stack/graphql)에 참고할 글 많음

---

240826

1. 정확한 정책(기능?을 주석으로 작성하고 함수 작성) 필요.
2. 회원탈퇴의 경우 지금은 table에서 삭제를 해버리는데 -> 그 사람이 작성한 댓글 등은 어떻게 처리할 지 정책을 정해야함.
3. debug 모드 사용으로 console.log 없이도 값을 볼 수 있어서 신세계!
