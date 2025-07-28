import { useSafeSetInterval } from '../hooks/useSafeSetInterval';
import { useState } from 'react';
const SafeTimerComponent = () => {
    const [timerCount, setTimerCount ] = useState(0);
    
    const timerCallback = () => {
        setTimerCount((c) => c + 1);
    };
    useSafeSetInterval(timerCallback, 1000);

    return (
        <p>타이머: {timerCount}초</p>
    )
}

export default SafeTimerComponent