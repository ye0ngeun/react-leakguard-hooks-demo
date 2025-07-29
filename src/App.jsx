import { useState, useEffect, useCallback } from 'react';
import LeakyComponent from './components/LeakyComponent';
import SafeComponent from './components/SafeComponent';


const MemoryLeakDemo = () => {
  const [leakyComponents, setLeakyComponents] = useState([]);
  const [safeComponents, setSafeComponents] = useState([]);
  const [eventLog, setEventLog] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  const handleEventCount = useCallback((type, eventName) => {
    if (isMonitoring) {
      const timestamp = new Date().toLocaleTimeString();
      setEventLog(prev => [
        ...prev.slice(-9), // 최근 10개만 유지
        { type, eventName, timestamp, id: Date.now() }
      ]);
    }
  }, [isMonitoring]);

  const addLeakyComponent = () => {
    const id = Date.now();
    setLeakyComponents(prev => [...prev, id]);
  };

  const addSafeComponent = () => {
    const id = Date.now();
    setSafeComponents(prev => [...prev, id]);
  };

  const removeAllLeaky = () => {
    setLeakyComponents([]);
    console.log('🗑️ 모든 LeakyComponent 제거됨 (하지만 이벤트 리스너는 여전히 활성화!)');
  };

  const removeAllSafe = () => {
    setSafeComponents([]);
    console.log('🗑️ 모든 SafeComponent 제거됨 (이벤트 리스너도 자동 정리됨)');
  };

  const clearEventLog = () => {
    setEventLog([]);
  };

  useEffect(() => {
    if (isMonitoring) {
      console.log('📊 이벤트 모니터링 시작 - 콘솔에서 이벤트 등록/해제 로그를 확인하세요');
    } else {
      console.log('📊 이벤트 모니터링 중지');
    }
  }, [isMonitoring]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          메모리 누수 방지 커스텀 훅<br/>
          효과 검증 데모 페이지
        </h1>
        <p className="text-gray-600 text-lg">
          우리FIS 아카데미 프론트엔드 세미나
        </p>
      </div>

      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">🎛️ 컨트롤 패널</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-bold text-red-600">❌ 메모리 누수 컴포넌트</h3>
            <div className="flex space-x-2">
              <button
                onClick={addLeakyComponent}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                누수 컴포넌트 추가
              </button>
              <button
                onClick={removeAllLeaky}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              >
                모두 제거
              </button>
            </div>
            <p className="text-sm text-red-600">
              활성 컴포넌트: {leakyComponents.length}개
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-green-600">✅ 안전한 컴포넌트</h3>
            <div className="flex space-x-2">
              <button
                onClick={addSafeComponent}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                안전 컴포넌트 추가
              </button>
              <button
                onClick={removeAllSafe}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
                모두 제거
              </button>
            </div>
            <p className="text-sm text-green-600">
              활성 컴포넌트: {safeComponents.length}개
            </p>
          </div>
        </div>
      </div>

      {isMonitoring && eventLog.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h2 className="font-bold text-purple-800 mb-2">📊 실시간 이벤트 로그</h2>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {eventLog.map(log => (
              <div key={log.id} className="text-xs">
                <span className={log.type === 'leak' ? 'text-red-600' : 'text-green-600'}>
                  [{log.timestamp}] {log.type === 'leak' ? '❌' : '✅'} {log.eventName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">❌ 메모리 누수 발생 구역</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {leakyComponents.map(id => (
              <LeakyComponent 
                key={id} 
                id={id} 
                onEventCount={handleEventCount}
              />
            ))}
            {leakyComponents.length === 0 && (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-center text-gray-500">
                메모리 누수 컴포넌트를 추가해보세요
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-green-600">✅ 안전한 메모리 관리 구역</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {safeComponents.map(id => (
              <SafeComponent 
                key={id} 
                id={id} 
                onEventCount={handleEventCount}
              />
            ))}
            {safeComponents.length === 0 && (
              <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg text-center text-gray-500">
                안전한 컴포넌트를 추가해보세요
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryLeakDemo;