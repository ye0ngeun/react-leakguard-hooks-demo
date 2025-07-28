import { useState, useCallback, useEffect, useRef } from 'react';
import { useSafeEventListener } from '../hooks/useSafeEventListener';
import { memoryTracker } from '../memoryTracker';

const SafeEventComponent = ({ onEventCount }) => {
  const [scrollCount, setScrollCount] = useState(0);
  const [resizeCount, setResizeCount] = useState(0);
  const [mouseCount, setMouseCount] = useState(0);
  const [keyCount, setKeyCount] = useState(0);

  // Memory simulation - same size as LeakyEventComponent
  const memoryData = useRef(new Array(10000).fill(0).map((_, i) => ({ id: i, data: `event-data-${i}` })));
  const memorySize = useRef(0);
  
    useEffect(() => {
    // Add memory usage
    memorySize.current = memoryData.current.length * 50; // 50 bytes per item simulation
    memoryTracker.addSafeMemory(memorySize.current);

    return () => {
      // ✅ Memory cleanup
      memoryTracker.removeSafeMemory(memorySize.current);
    };
  }, []);

    useSafeEventListener('scroll', useCallback(() => {
      setScrollCount(prev => prev + 1);
      onEventCount?.('safe', 'scroll');
    }, [onEventCount]));
  
    useSafeEventListener('resize', useCallback(() => {
      setResizeCount(prev => prev + 1);
      onEventCount?.('safe', 'resize');
    }, [onEventCount]));
  
    useSafeEventListener('mousemove', useCallback(() => {
      setMouseCount(prev => prev + 1);
      onEventCount?.('safe', 'mousemove');
    }, [onEventCount]));
  
    useSafeEventListener('keydown', useCallback(() => {
      setKeyCount(prev => prev + 1);
      onEventCount?.('safe', 'keydown');
    }, [onEventCount]));

  return (
    <>
    
        <p>스크롤: {scrollCount}회</p>
        <p>리사이즈: {resizeCount}회</p>
        <p>마우스 이동: {mouseCount}회</p>
        <p>키보드: {keyCount}회</p></>
  )
}

export default SafeEventComponent