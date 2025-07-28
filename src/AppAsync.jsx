// App.jsx 또는 다른 상위 컴포넌트에서

import { useState } from "react";
import LeakyAsync from "./components/LeakyAsync";
import SafeAsync from "./components/SafeAsync";

export default function App() {
  const [show, setShow] = useState(true);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔧 LeakyAsync 테스트</h1>
      <button onClick={() => setShow((prev) => !prev)}>
        {show ? "언마운트하기" : "마운트하기"}
      </button>

      {/* {show && <LeakyAsync />} */}
      { show && <SafeAsync/>}
    </div>
  );
}
