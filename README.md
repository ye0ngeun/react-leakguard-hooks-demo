# 🧠 React 메모리 누수 방지 커스텀 훅 데모

> React에서 이벤트 리스너로 인한 메모리 누수를 방지하는 `useSafeEventListener` 커스텀 훅의 실전 데모 사이트

## 🎯 프로젝트 개요

이 프로젝트는 React 애플리케이션에서 자주 발생하는 **메모리 누수 문제**와 이를 해결하는 **커스텀 훅**의 효과를 시각적으로 보여주는 교육용 데모입니다.

### 주요 기능
- 📊 **실시간 메모리 사용량 모니터링**
- 🔴 **메모리 누수 시뮬레이션** (잘못된 패턴)
- 🟢 **안전한 메모리 관리** (올바른 패턴)
- 🛠️ **Chrome DevTools 활용 가이드**
- 📈 **Before/After 성능 비교**

## 🚀 데모 실행

### 온라인 데모
👉 [Live Demo](https://your-demo-site.com) *(배포 후 링크 업데이트)*

### 로컬 실행
```bash
# 저장소 복제
git clone https://github.com/your-username/react-memory-leak-demo.git
cd react-memory-leak-demo

# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

## 📋 사용법

### 1. 기본 설정
1. Chrome 브라우저에서 데모 사이트 접속
2. `F12`로 개발자 도구 열기
3. **Memory** 탭 또는 **Performance** 탭 이동

### 2. 메모리 누수 체험
```
🔴 메모리 누수 테스트
├── "누수 컴포넌트 추가" 버튼 여러 번 클릭
├── 스크롤, 마우스 이동, 키보드 입력으로 이벤트 발생
├── Memory 탭에서 Heap snapshot 촬영
├── "모두 제거" 클릭 후 다시 snapshot 촬영
└── 📈 메모리가 해제되지 않음을 확인!
```

```
🟢 안전한 관리 테스트
├── "안전 컴포넌트 추가" 버튼 여러 번 클릭
├── 동일한 상호작용 수행
├── Memory 탭에서 Heap snapshot 촬영
├── "모두 제거" 클릭 후 다시 snapshot 촬영
└── ✅ 메모리가 적절히 해제됨을 확인!
```

### 3. Performance 모니터링
- Performance 탭에서 **Record** 시작
- 컴포넌트들과 상호작용
- **Memory 그래프**에서 누수 패턴 관찰

## 🔧 핵심 기술

### `useSafeEventListener` 커스텀 훅
```javascript
const useSafeEventListener = (eventName, handler, element = null, options = {}) => {
  // 최신 핸들러 참조 유지
  const handlerRef = useRef(handler);
  
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  // 자동 cleanup을 통한 메모리 누수 방지
  useEffect(() => {
    const targetElement = element || window;
    const eventHandler = (event) => handlerRef.current(event);
    
    targetElement.addEventListener(eventName, eventHandler, options);
    
    return () => {
      targetElement.removeEventListener(eventName, eventHandler, options);
    };
  }, [eventName, element, options]);
};
```

### 주요 해결 문제들
- ✅ **이벤트 리스너 자동 정리**
- ✅ **클로저 트랩(Stale Closure) 방지**
- ✅ **타이머 및 구독 정리**
- ✅ **메모리 사용량 제한**
- ✅ **SSR 환경 대응**

## 📊 성능 비교

| 구분 | 메모리 누수 컴포넌트 | 안전한 컴포넌트 |
|------|-------------------|----------------|
| 이벤트 리스너 정리 | ❌ 정리 안됨 | ✅ 자동 정리 |
| 타이머 관리 | ❌ 정리 안됨 | ✅ cleanup 함수 |
| 메모리 사용량 | 📈 지속적 증가 | 📊 일정 수준 유지 |
| 가비지 컬렉션 | ❌ 방해됨 | ✅ 정상 동작 |

## 🎓 교육 활용

### 세미나/강의 시나리오
1. **문제 인식**: 메모리 누수가 성능에 미치는 영향
2. **원인 분석**: 이벤트 리스너와 클로저 트랩
3. **해결책 제시**: 커스텀 훅을 통한 자동화
4. **실습**: Chrome DevTools로 실제 확인
5. **적용**: 실무 프로젝트에서의 활용법

### 학습 목표
- React의 메모리 관리 원리 이해
- 이벤트 리스너로 인한 메모리 누수 패턴 인식
- useRef와 useEffect를 활용한 해결책 구현
- 브라우저 개발자 도구 활용 능력 향상

## 🛠️ 기술 스택

- **Frontend**: React 18, JavaScript ES6+, Tailwind CSS
- **Build Tool**: Create React App / Vite
- **Monitoring**: Chrome DevTools Memory/Performance API
- **Deployment**: Vercel / Netlify (예정)

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── LeakyComponent.jsx        # 메모리 누수 시뮬레이션
│   ├── SafeComponent.jsx         # 안전한 메모리 관리
│   └── MemoryMonitor.jsx         # 실시간 모니터링
├── hooks/
│   └── useSafeEventListener.js   # 핵심 커스텀 훅
├── utils/
│   └── memoryUtils.js           # 메모리 관련 유틸
└── App.jsx                      # 메인 데모 애플리케이션
```

## 🤝 기여하기

이 프로젝트는 교육 목적으로 제작되었으며, 개선 아이디어나 버그 리포트를 환영합니다!

### 기여 방법
1. 이 저장소를 Fork
2. 새로운 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성

### 개선 아이디어
- [ ] TypeScript 버전 추가
- [ ] 더 다양한 메모리 누수 패턴 시뮬레이션
- [ ] 자동화된 성능 테스트 추가
- [ ] 모바일 반응형 개선
- [ ] 다국어 지원 (영어, 일본어)

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사의 말

이 프로젝트는 React 커뮤니티의 다양한 리소스와 경험을 바탕으로 제작되었습니다. 메모리 관리의 중요성에 대한 인식을 높이는 데 도움이 되기를 바랍니다.

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!

## 📚 참고 자료

- [React 공식 문서 - useEffect](https://react.dev/reference/react/useEffect)
- [MDN - Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [Chrome DevTools Memory 탭 사용법](https://developer.chrome.com/docs/devtools/memory/)
- [React 메모리 누수 방지 패턴](https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)