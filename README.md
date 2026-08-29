# 라이프 계산기 (Life Calculator)

[![Repo](https://img.shields.io/badge/GitHub-life--calculator-181717?logo=github)](https://github.com/andy1220-droid/life-calculator)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

**저장소**: https://github.com/andy1220-droid/life-calculator

단위 변환, 금융(복리, 세금, 대출), 디데이 등 일상생활에 필수적인 모든 계산을 한곳에서 직관적으로 처리하는 로컬 기반 올인원 웹 서비스입니다.

## 기능

- **대출 계산기**: 원리금균등 / 원금균등 / 만기일시상환 방식별 월 상환액, 총 이자, 상환 스케줄표
- **예적금 및 복리 계산기**: 거치식 / 적립식 × 단리 / 일복리 / 월복리 / 연복리, 세금 우대 적용
- **세금 및 연봉 계산기**: 직장인(4대보험 + 소득세 근사) / 프리랜서(3.3%) 실수령액
- **단위 변환기**: 면적(㎡ ↔ 평), 길이, 무게 실시간 변환
- **디데이 계산기**: 기준일 대비 목표일까지 남은/지난 일수
- **계산 기록**: 브라우저 Local Storage에 최근 10건 자동 저장, 클릭 시 해당 탭으로 이동하며 입력값 복원
- **다크 모드**, **결과 클립보드 복사**

## 기술 스택

- React + TypeScript, Vite
- Tailwind CSS + shadcn/ui (Base UI 기반)
- Zustand (Local Storage persist)
- dayjs, decimal.js

## 시작하기

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드
npm run lint     # oxlint
```

## 폴더 구조

```
src/
  components/
    layout/        # Header, TopNavigation
    common/         # ResultCard, HistoryPanel, Disclaimer, CopyResultButton
    ui/             # shadcn/ui 컴포넌트
  features/
    loan/ savings/ tax/ unit/ dday/   # 계산기별 UI
  store/            # themeStore, historyStore (Zustand)
  lib/
    calculations/   # 계산기별 순수 계산 로직
  types/            # 공통 타입 정의
```

## 참고

- 세율, 4대보험 요율 등은 매년 변동되므로 화면 하단 안내 문구를 참고해 실제 금액과 차이가 있을 수 있습니다.
- 계산 기록은 브라우저 Local Storage에만 저장되며, 기기 간 동기화되지 않습니다.

기획 배경은 [`prd.md`](./prd.md)를 참고하세요.
