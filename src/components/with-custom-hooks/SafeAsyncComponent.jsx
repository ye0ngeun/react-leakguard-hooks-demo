import useSafeAsync from '../../hooks/useSafeAsync';

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