import useSafeAsync from '../hooks/useSafeAsync';
import { useEffect, useRef } from 'react';
import { memoryTracker } from '../memoryTracker';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadUser(signal) {
  return fetch("https://jsonplaceholder.typicode.com/users/1", { signal })
    .then((res) => res.json())
    .then(async (data) => {
      await delay(3000); // ⏳ 일부러 지연
      return data;
    });
}

export default function SafeAsyncCompoent() {
  
    // Memory simulation - same size as LeakyAsyncComponent
    const memoryData = useRef(new Array(8000).fill(0).map((_, i) => ({ id: i, async: `async-${i}` })));
    const memorySize = useRef(0);
  
      useEffect(() => {
      // Add memory usage
      memorySize.current = memoryData.current.length * 60; // 60 bytes per item simulation
      memoryTracker.addSafeMemory(memorySize.current);
  
      return () => {
        // ✅ Memory cleanup
        memoryTracker.removeSafeMemory(memorySize.current);
      };
    }, []);

  const { status, result: user, error } = useSafeAsync(
    loadUser, 
    [], 
    {
      taskName: "LoadUser",
      keepAlive: true
    });

 return (
    <div >
        <h2>[비동기 요청] 유저 정보</h2>

        {status === "pending" && (<p>⏳ 로딩 중...</p>)}

        {error && (<p className="text-red-600 font-semibold">❌ 오류 발생: {error.message}</p>
        )}

        {user && (
            <ul>
            <li><strong>이름:</strong> {user.name}</li>
            <li><strong>웹사이트:</strong> {user.website}</li>
            <li><strong>회사:</strong> {user.company?.name}</li>
            </ul>
        )}
    </div>

  );
}