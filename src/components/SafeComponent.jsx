import SafeTimerComponent from './SafeTimerComponent';
import SafeEventComponent from './SafeEventComponent';
import SafeAsyncCompoent from './SafeAsyncComponent';

const SafeComponent = ({ id, onEventCount }) => {
  return (
    <div className="p-4 bg-green-100 border-2 border-green-300 rounded-lg">
      <h3 className="font-bold text-green-800">✅ 안전한 컴포넌트 #{id}</h3>
      <div className="text-green-700 space-y-1 text-sm">
        <SafeEventComponent onEventCount={onEventCount}/>
        <SafeTimerComponent/>
        <SafeAsyncCompoent/>
        <p className="text-xs text-green-600">
          useSafeEventListener로 자동 정리됨
        </p>
      </div>
    </div>
  );
};

export default SafeComponent;