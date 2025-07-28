import React from 'react'
import { useState, useEffect } from 'react';

const LeakyEventComponent = ({id, onEventCount}) => {
    const [scrollCount, setScrollCount] = useState(0);
    const [resizeCount, setResizeCount] = useState(0);
    const [mouseCount, setMouseCount] = useState(0);
    const [keyCount, setKeyCount] = useState(0);
    useEffect(() => {
    // 동일한 이벤트 핸들러들을 수동으로 등록
    const handleScroll = () => {
        setScrollCount(prev => prev + 1);
        onEventCount?.('leak', 'scroll');
    };

    const handleResize = () => {
        setResizeCount(prev => prev + 1);
        onEventCount?.('leak', 'resize');
    };

    const handleMouseMove = () => {
        setMouseCount(prev => prev + 1);
        onEventCount?.('leak', 'mousemove');
    };

    const handleKeyDown = () => {
        setKeyCount(prev => prev + 1);
        onEventCount?.('leak', 'keydown');
    };

    // ❌ 이벤트 리스너 등록만 하고 정리하지 않음
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    
    console.log(`❌ LeakyComponent ${id}: 이벤트 리스너 등록 (정리 안됨)`);

    // ❌ cleanup 함수가 없어서 메모리 누수 발생!
    }, [id, onEventCount]);

    return (
        <div>
            <p>스크롤: {scrollCount}회</p>
            <p>리사이즈: {resizeCount}회</p>
            <p>마우스 이동: {mouseCount}회</p>
            <p>키보드: {keyCount}회</p>
        </div>
    )
}

export default LeakyEventComponent