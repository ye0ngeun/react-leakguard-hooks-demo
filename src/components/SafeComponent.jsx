import { useState, useCallback } from 'react';
import { useSafeEventListener } from '../hooks/useSafeEventListener';

const SafeComponent = ({ id, onEventCount }) => {
  const [scrollCount, setScrollCount] = useState(0);
  const [resizeCount, setResizeCount] = useState(0);
  const [mouseCount, setMouseCount] = useState(0);
  const [keyCount, setKeyCount] = useState(0);

  // ✅ 동일한 이벤트 핸들러들을 커스텀 훅으로 등록
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
    <div className="p-4 bg-green-100 border-2 border-green-300 rounded-lg">
      <h3 className="font-bold text-green-800">✅ 안전한 컴포넌트 #{id}</h3>
      <div className="text-green-700 space-y-1 text-sm">
        <p>스크롤: {scrollCount}회</p>
        <p>리사이즈: {resizeCount}회</p>
        <p>마우스 이동: {mouseCount}회</p>
        <p>키보드: {keyCount}회</p>
        <p className="text-xs text-green-600">
          useSafeEventListener로 자동 정리됨
        </p>
      </div>
    </div>
  );
};

export default SafeComponent;