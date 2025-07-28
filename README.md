# 🧠 React 메모리 누수 방지 커스텀 훅 데모

> React에서 이벤트 리스너로 인한 메모리 누수를 방지하는 `useSafeEventListener` 커스텀 훅의 실전 데모 사이트

## 🎯 프로젝트 개요

이 프로젝트는 React 애플리케이션에서 자주 발생하는 **메모리 누수 문제**와 이를 해결하는 **커스텀 훅**의 효과를 시각적으로 보여주는 교육용 데모입니다.

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
