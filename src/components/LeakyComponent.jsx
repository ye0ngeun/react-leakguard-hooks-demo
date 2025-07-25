import { useState, useEffect, useRef } from 'react';

const LeakyComponent = ({ id, onMemoryUpdate }) => {
  const [data, setData] = useState(new Array(10000).fill(0).map((_, i) => ({ id: i, value: Math.random() })));
  const [eventCount, setEventCount] = useState(0);
  const intervalRef = useRef();
  const timeoutRef = useRef();

  useEffect(() => {
    // 1. 정리되지 않는 이벤트 리스너들
    const handleScroll = () => {
      setEventCount(prev => prev + 1);
      // 큰 데이터 처리로 메모리 사용량 증가
      const tempData = new Array(1000).fill(0).map(() => Math.random());
      tempData.forEach(item => item * 2); // 의미없는 연산
    };

    const handleResize = () => {
      setData(prev => [...prev, { id: Date.now(), value: Math.random() }]);
    };

    const handleMouseMove = (e) => {
      // DOM 요소들을 계속 참조하여 메모리 누수 발생
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        el.tempData = new Array(100).fill(Math.random());
      });
    };

    const handleKeyDown = () => {
      // 클로저에 큰 데이터를 포함
      const largeArray = new Array(5000).fill(0).map(() => ({ 
        data: Math.random(), 
        timestamp: Date.now(),
        largeString: 'x'.repeat(1000)
      }));
      setEventCount(prev => prev + largeArray.length % 10);
    };

    // ❌ 이벤트 리스너 등록만 하고 정리하지 않음
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    // 2. 정리되지 않는 타이머들
    intervalRef.current = setInterval(() => {
      // 메모리를 계속 할당하는 작업
      const wasteMemory = new Array(1000).fill(0).map(() => ({
        id: Math.random(),
        data: new Array(100).fill(Math.random()),
        timestamp: Date.now()
      }));
      
      // 전역 객체에 데이터 누적 (가비지 컬렉션 방해)
      if (!window.leakyData) window.leakyData = [];
      window.leakyData.push(...wasteMemory);
      
      onMemoryUpdate?.('leak', window.leakyData.length);
    }, 100);

    // 3. 체인된 타임아웃 (정리되지 않음)
    const createChainedTimeout = () => {
      timeoutRef.current = setTimeout(() => {
        const moreWaste = new Array(500).fill(0).map(() => Math.random());
        moreWaste.forEach(item => item * Math.random());
        createChainedTimeout(); // 재귀적으로 타임아웃 생성
      }, 200);
    };
    createChainedTimeout();

    // ❌ cleanup 함수가 없어서 메모리 누수 발생!
    console.log(`❌ LeakyComponent ${id}: 이벤트 리스너와 타이머가 정리되지 않음`);
  }, [id]);

  return (
    <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg">
      <h3 className="font-bold text-red-800">❌ 메모리 누수 컴포넌트 #{id}</h3>
      <div className="text-red-700 space-y-1">
        <p>데이터 크기: {data.length.toLocaleString()}개</p>
        <p>이벤트 발생 횟수: {eventCount}</p>
        <p className="text-xs">스크롤, 리사이즈, 마우스 이동, 키보드 입력 시 메모리 사용량 증가</p>
      </div>
    </div>
  );
};

export default LeakyComponent;