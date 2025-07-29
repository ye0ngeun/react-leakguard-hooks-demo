import { useEffect, useState } from "react";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function LeakyAsyncComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("[LeakyAsync] 마운트됨");

    fetch("https://jsonplaceholder.typicode.com/users/1")
      .then((res) => res.json())
      .then(async (data) => {
        await delay(3000); // ⏳ 일부러 지연
        setUser(data);
        console.log("[LeakyAsync] 데이터 패칭 완료됨");
        const bigArray = new Array(1000000).fill(0);
        console.log(bigArray);
      });

    return () => {
      console.log("[LeakyAsync] 언마운트됨");
      // 이 시점에 AbortController나 상태 추적 없이 클린업 없음
    };
  }, []);

  return (
    <div>
      <h2>[비동기 요청] 유저 정보</h2>
      {user ? (
        <ul>
          <li>
            <strong>이름:</strong> {user.name}
          </li>
          <li>
            <strong>웹사이트:</strong> {user.website}
          </li>
          <li>
            <strong>회사:</strong> {user.company?.name}
          </li>
        </ul>
      ) : (
        <p>⏳ 로딩 중...</p>
      )}
    </div>
  );
}
