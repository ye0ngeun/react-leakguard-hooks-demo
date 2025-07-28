import { useSafeSetInterval } from '../hooks/useSafeSetInterval';
import { useState, useEffect, useRef } from 'react';
import { memoryTracker } from '../memoryTracker';

const SafeTimerComponent = () => {
    const [ timerCount, setTimerCount ] = useState(0);
    
    // Memory simulation - same size as LeakyTimerComponent
    const memoryData = useRef(new Array(5000).fill(0).map((_, i) => ({ id: i, timer: `timer-${i}` })));
    const memorySize = useRef(0);

    useEffect(() => {
        // Add memory usage
        memorySize.current = memoryData.current.length * 40; // 40 bytes per item simulation
        memoryTracker.addSafeMemory(memorySize.current);

        return () => {
            // ✅ Memory cleanup
            memoryTracker.removeSafeMemory(memorySize.current);
        };
    }, []);

    const timerCallback = () => {
        setTimerCount((c) => c + 1);
    };
    useSafeSetInterval(timerCallback, 1000);

    return (
        <p>타이머: {timerCount}초</p>
    )
}

export default SafeTimerComponent