# StockVision 프로젝트 노트

## 📁 프로젝트 위치
```
C:\Users\jungi\주식
```

## 🔗 링크 모음
| 용도 | 주소 |
|------|------|
| GitHub 저장소 | https://github.com/1hanjung/stock-vision |
| GitHub Pages (공개) | https://1hanjung.github.io/stock-vision/ |
| 로컬 서버 | http://localhost:3000 |
| ngrok 공개 링크 | https://annis-panheaded-gideon.ngrok-free.dev |

---

## 📂 파일 구조
```
주식/
├── index.html       # 메인 HTML (UI 전체)
├── style.css        # 스타일 (다크/라이트 테마)
├── app.js           # 프론트엔드 로직 (API 호출, UI 렌더링)
├── server.js        # Node.js 백엔드 서버 (Yahoo Finance 프록시)
├── package.json     # 노드 패키지 설정
├── .gitignore       # node_modules, .env 제외
└── .claude/
    └── launch.json  # 서버 실행 설정 (포트 3000)
```

---

## 🚀 서버 실행 방법
### 로컬 서버 실행 (실시간 데이터)
```cmd
cd C:\Users\jungi\주식
node server.js
```
또는 Claude Code 미리보기에서 "주식 홈페이지" 서버 시작

### ngrok 외부 공개 (CMD에서 실행)
```cmd
ngrok http --url=annis-panheaded-gideon.ngrok-free.dev 3000
```
> ngrok 창을 닫으면 링크 끊김 — 열어둬야 함

---

## 🛠️ 기술 스택
- **프론트엔드**: 순수 HTML / CSS / JavaScript (프레임워크 없음)
- **백엔드**: Node.js HTTP 서버 (`server.js`)
- **차트**: Chart.js
- **데이터**: Yahoo Finance v8 chart API (`/v8/finance/chart/{symbol}`)
- **외부 공개**: ngrok (고정 도메인)
- **배포**: GitHub Pages (정적), 로컬+ngrok (실시간)

---

## 📡 API 구조 (server.js)
| 엔드포인트 | 설명 |
|-----------|------|
| `/api/quote?symbol=` | 주식 시세 (Yahoo Finance v8 chart meta) |
| `/api/chart?symbol=&range=` | 차트 데이터 |
| `/api/forex` | 환율 (달러/엔/유로 → 원) |
| `/api/feargreed` | 공포탐욕 지수 (alternative.me) |

### Yahoo Finance 심볼 규칙
```
삼성전자   → 005930.KS
SK하이닉스 → 000660.KS
KOSPI     → ^KS11
KOSDAQ    → ^KQ11
달러/원    → KRW=X
엔/원      → JPYKRW=X
유로/원    → EURKRW=X
```

---

## ✅ 구현된 기능
- [x] 실시간 주식 시세 (30초 자동 갱신)
- [x] KOSPI / KOSDAQ 지수
- [x] 환율 위젯 (달러/엔/유로)
- [x] 공포탐욕 지수 (alternative.me)
- [x] 가격 알림 🔔 (브라우저 알림 + localStorage 저장)
- [x] 관심종목 추가/제거
- [x] 포트폴리오 계산기 💼
- [x] 다크/라이트 테마 토글 🌙
- [x] 경제 캘린더
- [x] 스파크라인 미니 차트
- [x] 상승/하락 종목 Top 5
- [x] 주식 검색 필터
- [x] 토스트 알림

---

## ⚠️ 주의사항
- **GitHub Pages**는 정적 파일만 서빙 → API 연동 안 됨 (폴백 데이터 표시)
- **실시간 데이터**는 반드시 로컬 서버(`node server.js`) + ngrok 조합 필요
- Yahoo Finance **v7 quote API는 차단됨** → v8 chart API의 `meta` 필드 사용
- `app.js`에서 객체 키는 반드시 따옴표 필요: `{'1D':78,'1W':35,...}`

---

## 🔧 GitHub 작업
```cmd
# 변경사항 푸시
cd C:\Users\jungi\주식
git add index.html style.css app.js server.js
git commit -m "커밋 메시지"
git push origin main
```
GitHub Pages는 push 후 **1~2분** 후 자동 반영

---

## 📝 GitHub 계정 정보
- 사용자명: `1hanjung`
- 저장소명: `stock-vision`

---

_최종 업데이트: 2026-03-13_
