import { useSafeAsync } from "../hooks/useSafeAsync";

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

export default function SafeAsync() {
  const { status, result, error } = useSafeAsync(
    loadUser, 
    [], 
    {
      taskName: "LoadUser",
      keepAlive: true
    });

  return (
    <div>
      <h2>유저 정보</h2>
      <pre>{JSON.stringify(result, null, 2)}</pre>
      {status === "pending" && <p>⏳ 로딩 중...</p>}
      {error && <p style={{ color: "red" }}>❌ 오류 발생: {error.message}</p>}
    </div>
  );
}
