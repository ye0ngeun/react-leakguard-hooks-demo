import { useState, useEffect, useRef, useCallback } from 'react';
import { useSafeEventListener } from '../hooks/useSafeEventListener';

const SafeComponent = ({ id, onMemoryUpdate }) => {
  const [data, setData] = useState(new Array(1000).fill(0).map((_, i) => ({ id: i, value: Math.random() })));
  const [eventCount, setEventCount] = useState(0);
  const intervalRef = useRef();
  const cleanupRef = useRef([]);

  // ✅ 안전한 이벤트 리스너들
  useSafeEventListener('scroll', useCallback(() => {
    setEventCount(prev => prev + 1);
    // 효율적인 데이터 처리
    const tempData = new Array(100).fill(0).map(() => Math.random());
    tempData.forEach(item => item * 2);
  }, []));

  useSafeEventListener('resize', useCallback(() => {
    setData(prev => prev.length < 2000 ? [...prev, { id: Date.now(), value: Math.random() }] : prev);
  }, []));

  useSafeEventListener('mousemove', useCallback((e) => {
    // 메모리 효율적인 처리
    if (Math.random() > 0.99) { // 간헐적으로만 처리
      setEventCount(prev => prev + 1);
    }
  }, []), null, { passive: true });

  useSafeEventListener('keydown', useCallback(() => {
    // 적당한 크기의 데이터만 사용
    const smallArray = new Array(50).fill(0).map(() => Math.random());
    setEventCount(prev => prev + smallArray.length % 5);
  }, []));

  useEffect(() => {
    // ✅ 정리되는 타이머
    intervalRef.current = setInterval(() => {
      // 메모리 사용량을 제한
      const limitedData = new Array(50).fill(0).map(() => ({
        id: Math.random(),
        timestamp: Date.now()
      }));
      
      // 안전한 메모리 관리
      if (!window.safeData) window.safeData = [];
      window.safeData.push(...limitedData);
      
      // 크기 제한으로 메모리 누수 방지
      if (window.safeData.length > 1000) {
        window.safeData = window.safeData.slice(-500);
      }
      
      onMemoryUpdate?.('safe', window.safeData.length);
    }, 500);

    // ✅ cleanup 함수로 타이머 정리
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      console.log(`✅ SafeComponent ${id}: 모든 리소스가 정리됨`);
    };
  }, [id, onMemoryUpdate]);

  return (
    <div className="p-4 bg-green-100 border-2 border-green-300 rounded-lg">
      <h3 className="font-bold text-green-800">✅ 안전한 컴포넌트 #{id}</h3>
      <div className="text-green-700 space-y-1">
        <p>데이터 크기: {data.length.toLocaleString()}개</p>
        <p>이벤트 발생 횟수: {eventCount}</p>
        <p className="text-xs">메모리 사용량이 제한되고 자원이 자동으로 정리됨</p>
      </div>
    </div>
  );
};

export default SafeComponent;