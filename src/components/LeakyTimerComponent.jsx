import { useState, useEffect, useRef } from 'react';
import { memoryTracker } from '../memoryTracker';

const LeakyTimerComponent = () => {
  const [timerCount, setTimerCount ] = useState(0);  
  
  // Memory simulation - same size as SafeTimerComponent
  const memoryData = useRef(new Array(5000).fill(0).map((_, i) => ({ id: i, timer: `timer-${i}` })));
  
  useEffect(() => {
    // Add memory usage
    const memorySize = memoryData.current.length * 40; // 40 bytes per item simulation
    memoryTracker.addLeakyMemory(memorySize);
  }, []);

  // ❌ setInterval without cleanup
  setInterval(()=>{
    setTimerCount((c) => c + 1);
  },1000);
    
  return (
    <p>타이머: {timerCount}초</p>
  )
}

export default LeakyTimerComponent