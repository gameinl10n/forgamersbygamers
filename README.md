# 포트폴리오 사이트

게이머를 위한 개발자 포트폴리오 웹사이트입니다.

## 기술 스택

- React 18
- Vite
- CSS3

## 설치 및 실행

### 로컬 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버는 기본적으로 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 배포

### Vercel 배포

1. GitHub에 프로젝트를 푸시합니다.
2. [Vercel](https://vercel.com)에 로그인합니다.
3. "New Project"를 클릭하고 GitHub 저장소를 선택합니다.
4. Vercel이 자동으로 설정을 감지하고 배포합니다.

또는 Vercel CLI를 사용할 수 있습니다:

```bash
npm i -g vercel
vercel
```

## 프로젝트 구조

```
forgamersbygamers/
├── src/
│   ├── components/      # React 컴포넌트
│   │   ├── Header.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   └── Contact.jsx
│   ├── App.jsx         # 메인 앱 컴포넌트
│   ├── main.jsx        # 진입점
│   └── index.css       # 전역 스타일
├── index.html
├── package.json
├── vite.config.js
└── vercel.json         # Vercel 배포 설정
```

## 커스터마이징

- `src/components/About.jsx`: 소개 섹션 내용 수정
- `src/components/Skills.jsx`: 기술 스택 목록 수정
- `src/components/Projects.jsx`: 프로젝트 정보 수정
- `src/components/Contact.jsx`: 연락처 정보 수정
- CSS 파일들: 색상 및 스타일 커스터마이징

## 라이선스

MIT

