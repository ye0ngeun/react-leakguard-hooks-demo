import { useState, useCallback } from 'react';
import { useSafeEventListener } from '../hooks/useSafeEventListener';
import { useSafeSetInterval } from '../hooks/useSafeSetInterval';
import TimerComponent from './TimerComponent';
import EventComponent from './EventComponent';

const SafeComponent = ({ id, onEventCount }) => {
  return (
    <div className="p-4 bg-green-100 border-2 border-green-300 rounded-lg">
      <h3 className="font-bold text-green-800">✅ 안전한 컴포넌트 #{id}</h3>
      <div className="text-green-700 space-y-1 text-sm">
        <EventComponent onEventCount={onEventCount}/>
        <TimerComponent/>
        <p className="text-xs text-green-600">
          useSafeEventListener로 자동 정리됨
        </p>
      </div>
    </div>
  );
};

export default SafeComponent;