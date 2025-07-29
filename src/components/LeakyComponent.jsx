import LeakyEventComponent from "./LeakyEventComponent";
import LeakyTimerComponent from "./LeakyTimerComponent";
import LeakyAsyncComponent from "./LeakyAsyncComponent";

const LeakyComponent = ({ id, onEventCount }) => {
  return (
    <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg">
      <h3 className="font-bold text-red-800">❌ 메모리 누수 컴포넌트 #{id}</h3>
      <div className="text-red-700 space-y-1 text-sm">
        <LeakyEventComponent id={id} onEventCount={onEventCount} />
        <LeakyTimerComponent />
        <LeakyAsyncComponent />
        <p className="text-xs text-red-600">
          이벤트 리스너가 정리되지 않아 메모리 누수 발생
        </p>
      </div>
    </div>
  );
};

export default LeakyComponent;
