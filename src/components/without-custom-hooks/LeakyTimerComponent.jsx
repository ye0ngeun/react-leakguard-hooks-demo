import {useState} from 'react';
const LeakyTimerComponent = () => {
    const [timerCount, setTimerCount] = useState(0);
    setInterval(() => {
        setTimerCount((c) => c + 1);
        const bigArray = new Array(10000).fill(0);
        console.log(bigArray);
    }, 1000);

    return (<p>타이머: {timerCount}초</p>)
}

export default LeakyTimerComponent