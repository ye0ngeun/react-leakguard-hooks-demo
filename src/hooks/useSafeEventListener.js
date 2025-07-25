import { useEffect, useRef, useCallback } from "react";

/**
 * 안전하게 이벤트 리스너를 등록하고, 컴포넌트 언마운트 시 자동으로 해제해주는 커스텀 훅입니다.
 * 개발 환경에서는 클린업이 제대로 안 될 경우 경고 메시지를 출력합니다.
 *
 * @param {string} eventName - 등록할 이벤트 이름 (예: "click", "mousemove")
 * @param {Function} handler - 이벤트 발생 시 실행할 콜백 함수
 * @param {EventTarget} [element=window] - 이벤트 리스너를 등록할 대상 요소 (기본값: window)
 * @param {object} [options] - addEventListener 옵션 객체 (passive, capture 등)
 */
export function useSafeEventListener(eventName, handler, element = null, options = {}) {
  const cleanupCalled = useRef(false);
  const listenerActive = useRef(false);
  const handlerRef = useRef(handler);
  const optionsRef = useRef(options);

  // 최신 handler와 options를 항상 ref에 저장
  useEffect(() => {
    handlerRef.current = handler;
    optionsRef.current = options;
  }, [handler, options]);

  // 실제 이벤트 핸들러 (항상 최신 handler 호출)
  const eventHandler = useCallback((event) => {
    if (handlerRef.current && typeof handlerRef.current === 'function') {
    handlerRef.current(event);
    }
  }, []);

  useEffect(() => {
    // element가 null이면 window 사용
    const targetElement = element || (typeof window !== 'undefined' ? window : null);

    // 서버 사이드 렌더링 환경 체크
    if (typeof window === 'undefined') {
      return;
    }

    // handler 유효성 검사
    if (!handler || typeof handler !== 'function') {
      if (process.env.NODE_ENV === 'development') {
        console.warn (
          `[useSafeEventListener] "${eventName}"에 대해 유효하지 않은 핸들러가 전달되었습니다.`
        );
      }
      return;
    }

    // targetElement 유효성 검사
    if (!targetElement?.addEventListener) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[useSafeEventListener] "${eventName}"에 대해 유효하지 않은 요소가 전달되었습니다.`
        );
      }
      return;
    }

    // 리스너 등록
    cleanupCalled.current = false;
    listenerActive.current = true;

    try {
      targetElement.addEventListener(eventName, eventHandler, optionsRef.current);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[useSafeEventListener] "${eventName}" 이벤트 리스너가 등록되었습니다.`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[useSafeEventListener] "${eventName}" 이벤트 리스너 등록 중 오류가 발생했습니다:`,
          error
        );
      }
      listenerActive.current = false;
      return;
    }

    // cleanup 함수
    return () => {
      cleanupCalled.current = true;
      listenerActive.current = false;

      try {
        targetElement.removeEventListener(eventName, eventHandler, optionsRef.current);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[useSafeEventListener] "${eventName}" 이벤트 리스너가 해제되었습니다.`);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[useSafeEventListener] "${eventName}" 이벤트 리스너 해제 중 오류가 발생했습니다:`,
            error
          );
        }
      }
    };
  }, [eventName, eventHandler, element, options]);

  // 컴포넌트 언마운트 시 cleanup 검증 (개발환경에서만)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    return () => {
      if (listenerActive.current && !cleanupCalled.current) {
        console.warn(
          `[useSafeEventListener] ⚠️ 메모리 누수 발견! ` +
            `"${eventName}" 이벤트 리스너가 해제되지 않았습니다! ` +
            `컴포넌트가 정상적으로 언마운트되고 있는지 확인해 주세요!`
        );
      }
    };
  }, [eventName]);
}

// 사용 예시들:

// 1. 기본 사용법
// useSafeEventListener('click', handleClick);

// 2. 특정 요소에 이벤트 등록
// const buttonRef = useRef(null);
// useSafeEventListener('click', handleClick, buttonRef.current);

// 3. 옵션과 함께 사용
// useSafeEventListener('scroll', handleScroll, null, { passive: true });

// 4. capture phase에서 이벤트 처리
// useSafeEventListener('click', handleClick, null, { capture: true });

// 5. 한 번만 실행되는 이벤트
// useSafeEventListener('load', handleLoad, null, { once: true });