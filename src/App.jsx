import { useState, useEffect, useCallback } from 'react';
import LeakyComponent from './components/LeakyComponent';
import SafeComponent from './components/SafeComponent';


const MemoryLeakDemo = () => {
  const [leakyComponents, setLeakyComponents] = useState([]);
  const [safeComponents, setSafeComponents] = useState([]);
  const [memoryStats, setMemoryStats] = useState({ leak: 0, safe: 0 });
  const [isMonitoring, setIsMonitoring] = useState(false);

  const handleMemoryUpdate = useCallback((type, count) => {
    setMemoryStats(prev => ({ ...prev, [type]: count }));
  }, []);

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
    // 전역 메모리 정리
    if (window.leakyData) {
      delete window.leakyData;
    }
  };

  const removeAllSafe = () => {
    setSafeComponents([]);
    if (window.safeData) {
      delete window.safeData;
    }
  };

  const forceGarbageCollection = () => {
    // 가비지 컬렉션 강제 실행 (개발자 도구에서만 가능)
    if (window.gc) {
      window.gc();
      alert('가비지 컬렉션이 실행되었습니다. Memory 탭에서 변화를 확인해보세요.');
    } else {
      alert('가비지 컬렉션을 수동으로 실행하려면 Chrome을 --enable-precise-memory-info --js-flags="--expose-gc" 플래그와 함께 실행해야 합니다.');
    }
  };

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // 메모리 사용량 로깅
        if (performance.memory) {
          console.log('메모리 사용량:', {
            used: `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
            total: `${(performance.memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
            limit: `${(performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)}MB`,
            leakyData: window.leakyData?.length || 0,
            safeData: window.safeData?.length || 0
          });
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          메모리 누수 방지 커스텀 훅 효과 확인 데모 사이트
        </h1>
        <p className="text-gray-600 text-lg">
          우리FIS 아카데미 프론트엔드 세미나
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">🔍 메모리 모니터링 가이드</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Chrome DevTools 사용법:</h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-600">
              <li>F12를 눌러 개발자 도구 열기</li>
              <li>Memory 탭 클릭</li>
              <li>"Heap snapshot" 선택 후 "Take snapshot"</li>
              <li>컴포넌트 추가/제거 후 다시 스냅샷 촬영</li>
              <li>메모리 사용량 변화 비교</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Performance 탭 사용법:</h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-600">
              <li>Performance 탭에서 "Record" 시작</li>
              <li>컴포넌트들과 상호작용</li>
              <li>Recording 중지 후 Memory 그래프 확인</li>
              <li>메모리 누수 패턴 관찰</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">🎛️ 컨트롤 패널</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`px-4 py-2 rounded font-medium ${
                isMonitoring 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isMonitoring ? '모니터링 중지' : '모니터링 시작'}
            </button>
            <button
              onClick={forceGarbageCollection}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              GC 실행
            </button>
          </div>
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
              누적 메모리 데이터: {memoryStats.leak.toLocaleString()}개
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
              제한된 메모리 데이터: {memoryStats.safe.toLocaleString()}개
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">❌ 메모리 누수 발생 구역</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {leakyComponents.map(id => (
              <LeakyComponent 
                key={id} 
                id={id} 
                onMemoryUpdate={handleMemoryUpdate}
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
                onMemoryUpdate={handleMemoryUpdate}
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

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h2 className="font-bold text-yellow-800 mb-2">🧪 실험 시나리오</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-yellow-700 mb-2">메모리 누수 테스트:</h3>
            <ol className="list-decimal list-inside space-y-1 text-yellow-600">
              <li>누수 컴포넌트 5개 추가</li>
              <li>스크롤, 마우스 이동, 키보드 입력</li>
              <li>Memory 스냅샷 촬영</li>
              <li>컴포넌트 제거 후 다시 스냅샷</li>
              <li>메모리가 해제되지 않음을 확인</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-yellow-700 mb-2">안전한 관리 테스트:</h3>
            <ol className="list-decimal list-inside space-y-1 text-yellow-600">
              <li>안전 컴포넌트 5개 추가</li>
              <li>동일한 상호작용 수행</li>
              <li>Memory 스냅샷 촬영</li>
              <li>컴포넌트 제거 후 다시 스냅샷</li>
              <li>메모리가 적절히 해제됨을 확인</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryLeakDemo;