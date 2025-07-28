import { useEffect, useRef, useState, useCallback } from "react";

/**
 * 안전하게 비동기 작업을 실행하고, 컴포넌트 언마운트 시 자동으로 취소해주는 커스텀 훅입니다.
 * 개발 환경에서는 작업이 정리되지 않을 경우 경고를 출력합니다.
 *
 * @param {Function} asyncFn - AbortSignal을 인자로 받는 비동기 함수 (예: fetch(signal))
 * @param {Array} deps - 작업 실행 조건이 되는 의존성 배열
 * @param {Object} options - 옵션 객체
 * @param {boolean} [options.debug=true] - 디버깅 로그 출력 여부 (기본 값 true)
 * @param {string} [options.taskName="anonymousTask"] - 작업 식별용 이름 (로그 구분용)
 * @param {boolean} [options.keepAlive=false] - 언마운트 시 작업 필요 여부에 따라, cleanup 하기 위함(기본 값 false)
 */

export default function useSafeAsync(
  asyncFn,
  deps = [],
  { debug = true, taskName = "anonymousTask", keepAlive = false } = {}
) {
  const [status, setStatus] = useState("idle"); // idle | pending | success | error | cancelled
  const [result, setResult] = useState(null); // 작업 성공 시 결과
  const [error, setError] = useState(null); // 작업 실패 시 에러

  const abortControllerRef = useRef(null); // 현재 작업의 AbortController
  const currentCallId = useRef(0); // 중복 요청 구분을 위한 고유 ID
  const taskStarted = useRef(false); // 작업 실행 여부 (누수 추적용)
  const cleanupCalled = useRef(false); // cleanup이 실제 호출되었는지 추적

  /*
   * 실제 작업을 실행하는 함수
   */
  const execute = useCallback(() => {
    const callId = ++currentCallId.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    cleanupCalled.current = false;
    taskStarted.current = true;

    setStatus("pending");
    setResult(null);
    setError(null);

    debug && console.info(`[useSafeAsync] [${taskName}] 작업 시작`);

    asyncFn(controller.signal)
      .then((res) => {
        if (controller.signal.aborted || callId !== currentCallId.current) {
          debug &&
            console.warn(
              `[useSafeAsync] [${taskName}] 응답이 무시되었습니다: 작업이 취소되었거나 이전 요청입니다`
            );
          return;
        }

        setResult(res);
        setStatus("success");
        debug && console.info(`[useSafeAsync] [${taskName}] 작업 성공`);
      })
      .catch((err) => {
        if (controller.signal.aborted || callId !== currentCallId.current)
          return;

        setError(err);
        setStatus("error");
        debug && console.error(`[useSafeAsync] [${taskName}] 작업 실패`, err);
      });
  }, deps);

  /*
   * useEffect로 의존성 변경 시 작업 실행 및 정리
   */
  useEffect(() => {
    execute();

    // cleanup 시 비동기 요청 Abort
    return () => {
      if (!keepAlive) {
        abortControllerRef.current?.abort();
        cleanupCalled.current = true;
        setStatus("cancelled");
        debug &&
          console.warn(`[useSafeAsync] [${taskName}] 언마운트 - 작업 취소됨`);
      }
    };
  }, deps);

  /*
   * cleanup 누락 시 경고 출력 (개발 환경에서만 제공)
   */
  useEffect(() => {
    return () => {
      if (
        taskStarted.current &&
        !cleanupCalled.current &&
        process.env.NODE_ENV === "development"
      ) {
        console.warn(
          `[useSafeAsync][${taskName}] ⚠️ 메모리 누수 가능성! ` +
            `"${taskName}" 작업이 시작되었지만 언마운트 시 cleanup이 호출되지 않았습니다. ` +
            `AbortController를 활용한 정리가 누락되지 않았는지 확인하세요.`
        );
      }
    };
  }, [taskName]);

  return { execute, status, result, error };
}

// [사용 예시]

// 1. useSafeAsync() 사용 시, cleanup 감지 및 실행
// const { status, result, error } = useSafeAsync(
//     loadUser,
//     [],
//     {taskName: "LoadUser"});

// 2. useSafeAsync() 사용 시, cleanup 감지 (자동으로 실행은 안 해준다)
// const { status, result, error } = useSafeAsync(
//     loadUser,
//     [],
//     {taskName: "LoadUser",
//      keepAlive: true});
