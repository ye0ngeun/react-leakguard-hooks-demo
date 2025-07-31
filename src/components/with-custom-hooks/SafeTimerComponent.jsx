import {useSafeSetInterval} from 'leakguard-safe-hooks/src/hooks/useSafeSetInterval';
import {useState} from 'react';

const SafeTimerComponent = () => {
    const [timerCount, setTimerCount] = useState(0);

    const timerCallback = () => {
        setTimerCount((c) => c + 1);
        const bigArray = new Array(10000).fill(0);
        console.log(bigArray);
    };
    useSafeSetInterval(timerCallback, 1000);

    return (<p>타이머: {timerCount}초</p>)
}

export default SafeTimerComponent