import { useEffect, useRef } from "react";

/** 
 * 안전하게 setInterval을 등록하고, 컴포넌트 언마운트 시 자동으로 해제해주는 커스텀 훅입니다.
 * 개발 환경에서는 클린업이 제대로 안 될 경우 경고 메시지를 출력합니다.
 * 
 * @param {Function} callback - 일정 시간마다 실행할 함수
 * @param {number} delay - 밀리초(ms) 단위 간격
 */
export function useSafeSetInterval(callback, delay) {
  const intervalIdRef = useRef(null);
  const cleanupCalled = useRef(false);
  const intervalActive = useRef(false);

    
  useEffect(() => {
    // interval 등록
    const id = setInterval(callback, delay);
    intervalIdRef.current = id;
    intervalActive.current = true;
    cleanupCalled.current = false;
    
    // cleanup 함수
    return () => {
      cleanupCalled.current = true;
      intervalActive.current = false;

      clearInterval(id);
    };
  }, [callback, delay]);

  // 컴포넌트 언마운트 시 cleanup 검증 (개발환경에서만)
  useEffect(() => {
    return () => {
      if (
        intervalActive.current &&
        !cleanupCalled.current &&
        process.env.NODE_ENV === "development"
      ) {
        console.warn(
          `[useSafeSetInterval] ⚠️ 메모리 누수 발견! ` +
          `interval이 해제되지 않았습니다! ` +
          `컴포넌트가 정상적으로 언마운트되고 있는지 확인해 주세요!`
        );
      }
    };
  }, []);
}

// 사용 예시:
// 1. 기본 사용법
// useSafeSetInterval(callback, 1000);

// 2. useState와 함께 사용. 1초마다 count 1씩 증가
// const [count, setCount] = useState(0);
// const callback = () => {
//   setCount((c) => c + 1);
// }; 
// useSafeSetInterval(callback, 1000);