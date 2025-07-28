import React from 'react'
import { useState, useCallback } from 'react';
import { useSafeEventListener } from '../hooks/useSafeEventListener';

const SafeEventComponent = ({ onEventCount }) => {
  const [scrollCount, setScrollCount] = useState(0);
  const [resizeCount, setResizeCount] = useState(0);
  const [mouseCount, setMouseCount] = useState(0);
  const [keyCount, setKeyCount] = useState(0);

  
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