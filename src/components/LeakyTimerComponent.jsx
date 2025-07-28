import React from 'react'
import { useState } from 'react';
const LeakyTimerComponent = () => {
  const [timerCount, setTimerCount ] = useState(0);  
  setInterval(()=>{
    setTimerCount((c) => c + 1);
  },1000);
    
  return (
    <p>타이머: {timerCount}초</p>
  )
}

export default LeakyTimerComponent