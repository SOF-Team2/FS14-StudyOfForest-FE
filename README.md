
<p align="center">
  <img src="./src/assets/img/logo.png" alt="공부의 숲 로고" width="180" />
</p>

공부의 숲은 스터디를 만들고 함께 참여하며, 매일의 습관과 집중 기록을 관리하는 학습 커뮤니티 서비스입니다. 이 저장소는 React 기반 프론트엔드 애플리케이션입니다.

- Frontend: [FS14-StudyOfForest-FE](https://github.com/SOF-Team2/FS14-StudyOfForest-FE)
- Backend: [FS14-StudyOfForest-BE](https://github.com/SOF-Team2/FS14-StudyOfForest-BE)

## 주요 기능

| 영역 | 기능 |
| --- | --- |
| 사용자 | 회원가입, 로그인, 로그아웃, 로그인 상태별 사용자 메뉴 |
| 스터디 탐색 | 목록 조회, 연관 검색, 정렬, 최근 조회 목록, 즐겨찾기 |
| 스터디 관리 | 생성, 조회, 수정, 삭제, HOST 권한에 따른 관리 기능 노출 |
| 배경 설정 | 색상·기본 이미지 선택, 사용자 이미지 업로드, 압축, 드래그 위치 조정, 확대·축소, 카드 미리보기 |
| 참여·모집 | 참여하기, 나가기, 참여자 목록, 참여 인원, 정원 및 모집 상태 관리 |
| 상호작용 | 스터디 이모지 반응 추가 및 개수 표시 |
| 오늘의 습관 | 습관 목록 편집, 일일 달성 체크, 주간 기록 조회 |
| 오늘의 집중 | 집중 타이머, 집중 세션 저장, 집중 기록 타임라인, 포인트 반영 |
| 대시보드 | 오늘의 현황, 진행 중인 스터디, 즐겨찾기, 목표 및 업적 조회 |
| 랭킹 | 사용자·스터디 랭킹과 지난주 명예의 전당 조회 |
| 공통 UI | 반응형 레이아웃, 다크 모드, 전역 알림, 전역 로딩, 최상단 이동 버튼 |

## 기술 스택

| 구분 | 기술 | 사용 목적 |
| --- | --- | --- |
| UI | React 19 | 컴포넌트 기반 화면 구성 |
| Routing | React Router DOM 7 | 페이지 라우팅과 중첩 레이아웃 관리 |
| HTTP | Axios | 공용 API 인스턴스와 요청 인터셉터 구성 |
| Build | Vite 8 | 개발 서버와 프로덕션 번들 생성 |
| Style | CSS | 공통·페이지·다크 모드 스타일 및 반응형 UI |
| UI Library | emoji-picker-react | 스터디 이모지 선택 UI |
| Quality | ESLint | React Hooks와 JavaScript 정적 검사 |

## 화면 경로

| 경로 | 화면 | 주요 역할 |
| --- | --- | --- |
| `/` | 스터디 목록 | 기본 랜딩 및 스터디 둘러보기 |
| `/home` | 스터디 목록 | 로그인 후 홈 |
| `/signin` | 로그인 | 사용자 로그인 |
| `/signup` | 회원가입 | 사용자 계정 생성 |
| `/user/dashboard` | 대시보드 | 개인 활동과 스터디 현황 조회 |
| `/study-create` | 스터디 만들기 | 스터디 정보와 배경 설정 |
| `/study/:id` | 스터디 상세 | 상세 정보, 참여·모집, 이모지, HOST 관리 |
| `/study/:id/edit` | 스터디 수정 | 기존 스터디 정보와 배경 수정 |
| `/study/:id/habit` | 오늘의 습관 | 습관 편집, 체크, 주간 기록 조회 |
| `/study/:id/focus` | 오늘의 집중 | 집중 타이머와 세션 기록 조회 |
| `/ranking` | 랭킹 | 사용자·스터디 주간 랭킹 조회 |

## 프로젝트 구조

```text
FS14-StudyOfForest-FE/
├── public/
│   ├── _redirects                 # Netlify SPA 라우팅 설정
│   └── favicon.svg
├── src/
│   ├── assets/img/                # 로고, 아이콘, 배경, 스티커 이미지
│   ├── components/
│   │   ├── achieve/               # 업적 UI와 조회 Hook
│   │   ├── focus/                 # 집중 타이머와 타임라인
│   │   ├── habit/                 # 습관 목록·편집·주간 기록
│   │   ├── ranking/               # 사용자·스터디 랭킹
│   │   ├── study/                 # 스터디 카드·검색·배경·삭제 모달
│   │   └── user/                  # 로그인 상태별 사용자 메뉴
│   ├── contexts/                  # 전역 로딩 Context
│   ├── layout/                    # 공통 레이아웃
│   ├── mocks/                     # 개발용 목 데이터
│   ├── pages/                     # 라우트 단위 페이지
│   ├── utils/                     # Axios, 인증 저장소, 배경 처리 유틸
│   ├── App.jsx                    # 공통 화면 골격과 전역 스타일
│   ├── main.jsx                   # Provider와 라우트 선언
│   └── index.jsx                  # React 진입점
├── .env                           # 기본 API 주소, Git 제외
├── .env.local-api                 # 로컬 API 주소, Git 제외
├── package.json
└── vite.config.js
```

## 실행 방법

### 1. 요구 환경

- Node.js `^20.19.0` 또는 `>=22.12.0`
- npm
- API 연동 시 실행 중인 백엔드 서버

### 2. 설치

```bash
git clone https://github.com/SOF-Team2/FS14-StudyOfForest-FE.git
cd FS14-StudyOfForest-FE
npm ci
```

### 3. 환경 변수

환경 변수 파일은 Git에 포함되지 않으므로 실행 환경에 맞게 생성합니다.

Render API를 기본으로 사용할 때:

```dotenv
# .env
VITE_API_BASE_URL=https://fs14-studyofforest-be.onrender.com
```

로컬 백엔드를 사용할 때:

```dotenv
# .env.local-api
VITE_API_BASE_URL=http://127.0.0.1:3000
```

`VITE_API_BASE_URL`에는 마지막 `/`를 붙이지 않습니다. 환경 변수를 변경한 후에는 Vite 개발 서버를 다시 실행해야 합니다.

### 4. 개발 서버 실행

```bash
# Render API 사용
npm run dev

# 로컬 API 사용
npm run dev:local
```

기본 개발 서버 주소는 `http://localhost:5173`입니다.

## npm 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 기본 환경의 Vite 개발 서버 실행 |
| `npm run dev:local` | `local-api` 모드로 로컬 백엔드 연결 |
| `npm run dev:render` | `render` 모드로 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run build:local` | 로컬 API 기준 빌드 생성 |
| `npm run build:render` | Render API 기준 빌드 생성 |
| `npm run lint` | 전체 소스 ESLint 검사 |
| `npm run preview` | 생성된 `dist` 빌드 미리보기 |

## API 및 로그인 상태 처리

모든 API 요청은 `src/utils/axios.js`의 공용 Axios 인스턴스를 사용합니다.

```text
페이지 또는 컴포넌트
    ↓
공용 Axios 인스턴스
    ├── baseURL: VITE_API_BASE_URL
    └── x-user-id: localStorage의 userId
    ↓
Backend API
```

로그인에 성공하면 사용자 ID를 `localStorage`에 저장합니다. 이후 Axios 요청 인터셉터가 로그인·회원가입을 제외한 API 요청에도 필요한 `x-user-id` 헤더를 자동으로 추가합니다. 로그아웃하면 저장된 사용자 ID를 제거합니다.

현재 구조는 프로젝트 API 계약에 맞춘 사용자 식별 방식입니다. 운영 수준의 보안을 위해서는 백엔드에서 세션 또는 검증 가능한 토큰 기반 인증을 적용해야 합니다.

## 전역 UI 상태

- `AlertProvider`: 성공·오류·로딩 메시지와 표시·종료 애니메이션을 관리합니다.
- `LoadingProvider`: 동시에 실행되는 비동기 작업 수를 기준으로 전역 로딩 상태를 관리합니다.
- `GlobalLoading`: 로딩 중 공통 오버레이를 표시합니다.
- `Header`: 로그인 여부에 따라 로그인·회원가입 또는 대시보드·스터디 등록·로그아웃 메뉴를 표시합니다.

## 배포

프론트엔드는 정적 빌드 결과물인 `dist` 디렉터리를 배포합니다.

```bash
npm ci
npm run build
```

Netlify 설정 기준:

| 항목 | 값 |
| --- | --- |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Environment variable | `VITE_API_BASE_URL` |

`public/_redirects`가 모든 경로를 `/index.html`로 연결하므로, React Router 경로에서 새로고침해도 SPA 라우팅이 유지됩니다. 배포 환경에서는 백엔드 CORS 허용 Origin에 프론트엔드 배포 주소가 등록되어 있어야 합니다.

## 개발 규칙

- 컴포넌트와 페이지 파일은 `PascalCase`를 사용합니다.
- 커스텀 Hook은 `use`로 시작합니다.
- 공용 API 요청은 직접 Axios 인스턴스를 만들지 않고 `src/utils/axios.js`를 사용합니다.
- 라우트 단위 화면은 `src/pages`, 재사용 UI는 `src/components`에 배치합니다.
- 비밀값과 환경별 주소는 코드에 하드코딩하지 않고 환경 변수로 관리합니다.
- 변경 후 `npm run lint`와 `npm run build`로 정적 검사와 빌드를 확인합니다.
